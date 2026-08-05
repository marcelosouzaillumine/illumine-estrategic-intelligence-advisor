export interface FinancialDataQueryOptions {
  tenantId: string;
  periodId: string;
  accountId?: string;
  type?: 'actual' | 'budget' | 'forecast';
}

export interface FinancialRepository {
  getFinancialData(options: FinancialDataQueryOptions): Promise<any>;
  saveFinancialData(data: any): Promise<void>;
}
