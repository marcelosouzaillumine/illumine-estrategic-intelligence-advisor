import { SupabaseClient } from '@supabase/supabase-js';
import { ICashFlowPersistence, OperationalData } from '../../contracts/persistence/ICashFlowPersistence';

export class SupabaseCashFlowAdapter implements ICashFlowPersistence {
  constructor(private readonly supabase: SupabaseClient) {}

  async getOperationalData(tenantId: string): Promise<OperationalData> {
    // In canonical PostgreSQL, payables/receivables/positions might be represented by journal entries and accounts.
    // For now, we simulate fetching the legacy format from a mirror view or mapping from journal entries.
    // The ETL will migrate legacy 'financial_entries' into 'journal_entries'.
    const { data: payables } = await this.supabase.from('finance.vw_legacy_payables').select('*').eq('client_id', tenantId);
    const { data: receivables } = await this.supabase.from('finance.vw_legacy_receivables').select('*').eq('client_id', tenantId);
    const { data: positions } = await this.supabase.from('finance.vw_legacy_positions').select('*').eq('client_id', tenantId);

    return {
      payables: payables || [],
      receivables: receivables || [],
      positions: positions || []
    };
  }

  async saveCashFlow(tenantId: string, ownerId: string | undefined, cashFlowData: any): Promise<void> {
    const { error } = await this.supabase
      .from('finance.legacy_cash_flows')
      .insert({
        company_id: tenantId,
        owner_id: ownerId,
        payload: cashFlowData,
        created_at: new Date().toISOString() // No Firestore serverTimestamp()
      });

    if (error) throw new Error(`Supabase write failed: ${error.message}`);
  }

  async getFinancialEntries(tenantId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .schema('finance')
      .from('journal_entries')
      .select('*')
      .eq('company_id', tenantId);
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return data || [];
  }

  async getBudgets(tenantId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('finance.legacy_budgets')
      .select('*')
      .eq('company_id', tenantId);
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return data || [];
  }

  async getCashFlowsByClient(tenantId: string, ownerId?: string): Promise<any[]> {
    let query = this.supabase.from('finance.legacy_cash_flows').select('*').eq('company_id', tenantId);
    if (ownerId) query = query.eq('owner_id', ownerId);
    
    const { data, error } = await query;
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return (data || []).map(d => d.payload);
  }

  async getAllCashFlowsByClient(tenantId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('finance.legacy_cash_flows')
      .select('*')
      .eq('company_id', tenantId);
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return (data || []).map(d => d.payload);
  }
}
