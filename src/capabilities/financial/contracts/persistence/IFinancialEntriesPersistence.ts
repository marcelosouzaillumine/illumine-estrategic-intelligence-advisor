export interface IFinancialEntriesPersistence {
  getEntriesByTypesAndYear(tenantId: string, queryTypes: string[], year: number): Promise<{ docs: any[] }>;
  getAllEntriesForClient(tenantId: string): Promise<{ docs: any[] }>;
  getEntriesByYear(tenantId: string, year: number): Promise<{ docs: any[] }>;
  getEntriesInYears(tenantId: string, targetYears: number[]): Promise<{ docs: any[] }>;
}
