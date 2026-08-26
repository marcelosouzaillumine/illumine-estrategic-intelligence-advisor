import { SupabaseClient } from '@supabase/supabase-js';
import { IFinancialEntriesPersistence } from '../../contracts/persistence/IFinancialEntriesPersistence';

export class SupabaseFinancialEntriesAdapter implements IFinancialEntriesPersistence {
  constructor(private readonly supabase: SupabaseClient) {}

  private mapToLegacyFormat(postgresData: any[]): { docs: any[] } {
    return {
      docs: postgresData.map(row => {
        // The entire legacy structure is in row.payload
        return {
          id: row.legacy_id || row.id,
          ...row.payload
        };
      })
    };
  }

  async getEntriesByTypesAndYear(tenantId: string, queryTypes: string[], year: number): Promise<{ docs: any[] }> {
    const { data, error } = await this.supabase
      .schema('finance')
      .from('legacy_financial_entries')
      .select('*')
      .eq('company_id', tenantId);

    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    
    // Filtering on JSONB payload fields since PostgREST jsonb filtering syntax might be complex here
    const filtered = (data || []).filter(row => {
      const payload = row.payload || {};
      return queryTypes.includes(payload.type) && payload.year === year;
    });

    return this.mapToLegacyFormat(filtered);
  }

  async getAllEntriesForClient(tenantId: string): Promise<{ docs: any[] }> {
    const { data, error } = await this.supabase
      .schema('finance')
      .from('legacy_financial_entries')
      .select('*')
      .eq('company_id', tenantId);

    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return this.mapToLegacyFormat(data || []);
  }

  async getEntriesByYear(tenantId: string, year: number): Promise<{ docs: any[] }> {
    const { data, error } = await this.supabase
      .schema('finance')
      .from('legacy_financial_entries')
      .select('*')
      .eq('company_id', tenantId);

    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    
    const filtered = (data || []).filter(row => (row.payload || {}).year === year);
    return this.mapToLegacyFormat(filtered);
  }

  async getEntriesInYears(tenantId: string, targetYears: number[]): Promise<{ docs: any[] }> {
    const { data, error } = await this.supabase
      .schema('finance')
      .from('legacy_financial_entries')
      .select('*')
      .eq('company_id', tenantId);

    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    
    const filtered = (data || []).filter(row => targetYears.includes((row.payload || {}).year));
    return this.mapToLegacyFormat(filtered);
  }
}
