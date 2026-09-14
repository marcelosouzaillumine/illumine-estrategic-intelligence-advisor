import { IFinancialEntriesPersistence } from '../../../../contracts/persistence/IFinancialEntriesPersistence';

export class FinancialRepository {
  constructor(private entriesPersistence: IFinancialEntriesPersistence) {}

  async getEntriesByTypesAndYear(tenantId: string, queryTypes: string[], year: number): Promise<{ docs: any[] }> {
    return this.entriesPersistence.getEntriesByTypesAndYear(tenantId, queryTypes, year);
  }

  async getAllEntriesForClient(tenantId: string): Promise<{ docs: any[] }> {
    return this.entriesPersistence.getAllEntriesForClient(tenantId);
  }

  async getEntriesByYear(tenantId: string, year: number): Promise<{ docs: any[] }> {
    return this.entriesPersistence.getEntriesByYear(tenantId, year);
  }

  async getEntriesInYears(tenantId: string, targetYears: number[]): Promise<{ docs: any[] }> {
    return this.entriesPersistence.getEntriesInYears(tenantId, targetYears);
  }
}
