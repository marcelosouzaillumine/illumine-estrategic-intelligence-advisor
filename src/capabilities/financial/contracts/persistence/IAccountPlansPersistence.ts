export interface IAccountPlansPersistence {
  listenToAccountPlanGeneric(tenantId: string, planType: string | undefined, onUpdate: (accounts: any[]) => void, onError: (error: any) => void): () => void;
  listenToAccountPlans(tenantId: string, planType: string, onUpdate: (accounts: any[]) => void, onLegacyMigration: (legacyDocs: any[]) => void): () => void;
  migrateLegacyAccounts(legacyDocs: any[]): Promise<void>;
  listenToAccountingAccounts(tenantId: string, onUpdate: (accounts: any[]) => void): () => void;
  addAccountPlan(payload: any): Promise<void>;
  updateAccountPlan(id: string, payload: any): Promise<void>;
  deleteAccountPlan(id: string): Promise<void>;
  bulkAddDefaultPlans(defaultPlan: any[], tenantId: string, clientName: string, planType: string): Promise<void>;
  clearAllItems(tenantId: string, type: string): Promise<void>;
  saveAllNewAccounts(selectedClient: string, planType: string, unassignedAccounts: any[]): Promise<number>;
}
