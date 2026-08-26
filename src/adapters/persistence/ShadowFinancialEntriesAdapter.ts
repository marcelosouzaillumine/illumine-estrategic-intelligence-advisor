import { IFinancialEntriesPersistence } from '../../contracts/persistence/IFinancialEntriesPersistence';

export class ShadowFinancialEntriesAdapter implements IFinancialEntriesPersistence {
  constructor(
    private readonly postgresAdapter: IFinancialEntriesPersistence,
    private readonly firestoreAdapter: IFinancialEntriesPersistence
  ) {}

  private async compareAndLog(operation: string, postgresPromise: Promise<any>, firestorePromise: Promise<any>) {
    try {
      const [pgResult, fsResult] = await Promise.all([postgresPromise, firestorePromise]);
      
      const pgCount = pgResult?.docs?.length || 0;
      const fsCount = fsResult?.docs?.length || 0;

      if (pgCount === fsCount) {
        console.log(`[SHADOW ORACLE] ${operation} - MATCH: Cardinality matched (${pgCount} records)`);
        // TODO: Deep equality check on balances, debits, credits
      } else {
        console.warn(`[SHADOW ORACLE] ${operation} - MISMATCH: Postgres returned ${pgCount}, Firestore returned ${fsCount}`);
      }
    } catch (e: any) {
      console.error(`[SHADOW ORACLE] ${operation} - COMPARISON FAILED:`, e.message);
    }
  }

  async getEntriesByTypesAndYear(tenantId: string, queryTypes: string[], year: number): Promise<{ docs: any[] }> {
    const pgPromise = this.postgresAdapter.getEntriesByTypesAndYear(tenantId, queryTypes, year);
    const fsPromise = this.firestoreAdapter.getEntriesByTypesAndYear(tenantId, queryTypes, year);
    
    // Non-blocking oracle comparison
    this.compareAndLog(`getEntriesByTypesAndYear(${tenantId}, ${year})`, pgPromise, fsPromise);
    
    // Always return Postgres as canonical
    return pgPromise;
  }

  async getAllEntriesForClient(tenantId: string): Promise<{ docs: any[] }> {
    const pgPromise = this.postgresAdapter.getAllEntriesForClient(tenantId);
    const fsPromise = this.firestoreAdapter.getAllEntriesForClient(tenantId);
    
    this.compareAndLog(`getAllEntriesForClient(${tenantId})`, pgPromise, fsPromise);
    
    return pgPromise;
  }

  async getEntriesByYear(tenantId: string, year: number): Promise<{ docs: any[] }> {
    const pgPromise = this.postgresAdapter.getEntriesByYear(tenantId, year);
    const fsPromise = this.firestoreAdapter.getEntriesByYear(tenantId, year);
    
    this.compareAndLog(`getEntriesByYear(${tenantId}, ${year})`, pgPromise, fsPromise);
    
    return pgPromise;
  }

  async getEntriesInYears(tenantId: string, targetYears: number[]): Promise<{ docs: any[] }> {
    const pgPromise = this.postgresAdapter.getEntriesInYears(tenantId, targetYears);
    const fsPromise = this.firestoreAdapter.getEntriesInYears(tenantId, targetYears);
    
    this.compareAndLog(`getEntriesInYears(${tenantId})`, pgPromise, fsPromise);
    
    return pgPromise;
  }
}
