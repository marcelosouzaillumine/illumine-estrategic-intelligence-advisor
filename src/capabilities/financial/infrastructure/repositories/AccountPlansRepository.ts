import { IAccountPlansPersistence } from '../../../../contracts/persistence/IAccountPlansPersistence';

export class AccountPlansRepository {
  constructor(private persistence: IAccountPlansPersistence) {}

  listenToAccountPlanGeneric(tenantId: string, planType: string | undefined, onUpdate: (accounts: any[]) => void, onError: (error: any) => void): () => void {
    return this.persistence.listenToAccountPlanGeneric(tenantId, planType, onUpdate, onError);
  }

  listenToAccountPlans(tenantId: string, planType: string, onUpdate: (accounts: any[]) => void, onLegacyMigration: (legacyDocs: any[]) => void): () => void {
    return this.persistence.listenToAccountPlans(tenantId, planType, onUpdate, onLegacyMigration);
  }

  async migrateLegacyAccounts(legacyDocs: any[]): Promise<void> {
    return this.persistence.migrateLegacyAccounts(legacyDocs);
  }

  listenToAccountingAccounts(tenantId: string, onUpdate: (accounts: any[]) => void): () => void {
    return this.persistence.listenToAccountingAccounts(tenantId, onUpdate);
  }

  async addAccountPlan(payload: any): Promise<void> {
    return this.persistence.addAccountPlan(payload);
  }

  async updateAccountPlan(id: string, payload: any): Promise<void> {
    return this.persistence.updateAccountPlan(id, payload);
  }

  async deleteAccountPlan(id: string): Promise<void> {
    return this.persistence.deleteAccountPlan(id);
  }

  async bulkAddDefaultPlans(defaultPlan: any[], tenantId: string, clientName: string, planType: string): Promise<void> {
    return this.persistence.bulkAddDefaultPlans(defaultPlan, tenantId, clientName, planType);
  }

  async clearAllItems(tenantId: string, type: string): Promise<void> {
    return this.persistence.clearAllItems(tenantId, type);
  }

  async saveAllNewAccounts(selectedClient: string, planType: string, unassignedAccounts: any[]): Promise<number> {
    return this.persistence.saveAllNewAccounts(selectedClient, planType, unassignedAccounts);
  }
}
