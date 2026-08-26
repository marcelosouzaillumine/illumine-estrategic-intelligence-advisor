import { SupabaseClient } from '@supabase/supabase-js';
import { IAccountPlansPersistence } from '../../contracts/persistence/IAccountPlansPersistence';

export class SupabaseAccountPlansAdapter implements IAccountPlansPersistence {
  constructor(private readonly supabase: SupabaseClient) {}

  async getAccountPlansForClient(tenantId: string): Promise<{ docs: any[] }> {
    const { data, error } = await this.supabase
      .schema('finance')
      .from('legacy_account_plans')
      .select('*')
      .eq('company_id', tenantId);

    if (error) {
      console.error('Supabase error fetching account plans:', error);
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    return {
      docs: (data || []).map(row => ({
        id: row.legacy_id || row.id,
        ...row.payload
      }))
    };
  }

  listenToAccountPlanGeneric(tenantId: string, planType: string | undefined, onUpdate: (accounts: any[]) => void, onError: (error: any) => void): () => void {
    this.getAccountPlansForClient(tenantId).then(({ docs }) => {
      onUpdate(docs);
    }).catch(onError);
    return () => {};
  }

  listenToAccountPlans(tenantId: string, planType: string, onUpdate: (accounts: any[]) => void, onLegacyMigration: (legacyDocs: any[]) => void): () => void {
    this.getAccountPlansForClient(tenantId).then(({ docs }) => {
      onUpdate(docs);
    }).catch(console.error);
    return () => {};
  }

  listenToAccountingAccounts(tenantId: string, onUpdate: (accounts: any[]) => void): () => void {
    this.getAccountPlansForClient(tenantId).then(({ docs }) => {
      onUpdate(docs);
    }).catch(console.error);
    return () => {};
  }

  async migrateLegacyAccounts(legacyDocs: any[]): Promise<void> {
    throw new Error('MIGRATION_ONLY: Cannot migrate from runtime.');
  }

  async addAccountPlan(payload: any): Promise<void> {
    throw new Error('Not implemented for Supabase yet');
  }

  async updateAccountPlan(id: string, payload: any): Promise<void> {
    throw new Error('Not implemented for Supabase yet');
  }

  async deleteAccountPlan(id: string): Promise<void> {
    throw new Error('Not implemented for Supabase yet');
  }

  async bulkAddDefaultPlans(defaultPlan: any[], tenantId: string, clientName: string, planType: string): Promise<void> {
    throw new Error('Not implemented for Supabase yet');
  }

  async clearAllItems(tenantId: string, type: string): Promise<void> {
    throw new Error('Not implemented for Supabase yet');
  }

  async saveAllNewAccounts(selectedClient: string, planType: string, unassignedAccounts: any[]): Promise<number> {
    throw new Error('Not implemented for Supabase yet');
  }
}
