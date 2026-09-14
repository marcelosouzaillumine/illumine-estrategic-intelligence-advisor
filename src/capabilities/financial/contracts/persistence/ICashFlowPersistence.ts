export interface OperationalData {
  payables: any[];
  receivables: any[];
  positions: any[];
}

export interface ICashFlowPersistence {
  getOperationalData(tenantId: string): Promise<OperationalData>;
  saveCashFlow(tenantId: string, ownerId: string | undefined, cashFlowData: any): Promise<void>;
  getFinancialEntries(tenantId: string): Promise<any[]>;
  getBudgets(tenantId: string): Promise<any[]>;
  getCashFlowsByClient(tenantId: string, ownerId?: string): Promise<any[]>;
  getAllCashFlowsByClient(tenantId: string): Promise<any[]>;
}
