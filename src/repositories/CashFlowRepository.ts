import { ICashFlowPersistence, OperationalData } from '../contracts/persistence/ICashFlowPersistence';

export class CashFlowRepository {
  constructor(private persistence: ICashFlowPersistence) {}

  async getOperationalData(tenantId: string): Promise<OperationalData> {
    return this.persistence.getOperationalData(tenantId);
  }

  async saveCashFlow(tenantId: string, ownerId: string | undefined, cashFlowData: any): Promise<void> {
    return this.persistence.saveCashFlow(tenantId, ownerId, cashFlowData);
  }

  async getFinancialEntries(tenantId: string): Promise<any[]> {
    return this.persistence.getFinancialEntries(tenantId);
  }

  async getBudgets(tenantId: string): Promise<any[]> {
    return this.persistence.getBudgets(tenantId);
  }

  async getCashFlowsByClient(tenantId: string, ownerId?: string): Promise<any[]> {
    return this.persistence.getCashFlowsByClient(tenantId, ownerId);
  }

  async getAllCashFlowsByClient(tenantId: string): Promise<any[]> {
    return this.persistence.getAllCashFlowsByClient(tenantId);
  }
}
