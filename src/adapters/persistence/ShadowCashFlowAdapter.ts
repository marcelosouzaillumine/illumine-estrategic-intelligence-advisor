import { ICashFlowPersistence, OperationalData } from '../../contracts/persistence/ICashFlowPersistence';

export class ShadowCashFlowAdapter implements ICashFlowPersistence {
  constructor(
    private readonly postgresAdapter: ICashFlowPersistence,
    private readonly firestoreAdapter: ICashFlowPersistence
  ) {}

  private async compareAndLog(operation: string, postgresPromise: Promise<any>, firestorePromise: Promise<any>) {
    try {
      const [pgResult, fsResult] = await Promise.all([postgresPromise, firestorePromise]);
      
      const pgHasData = Array.isArray(pgResult) ? pgResult.length : Object.keys(pgResult || {}).length;
      const fsHasData = Array.isArray(fsResult) ? fsResult.length : Object.keys(fsResult || {}).length;

      if (pgHasData === fsHasData) {
        console.log(`[SHADOW ORACLE] CashFlow - ${operation} - MATCH: Cardinality matched`);
      } else {
        console.warn(`[SHADOW ORACLE] CashFlow - ${operation} - MISMATCH: Postgres returned ${pgHasData}, Firestore returned ${fsHasData}`);
      }
    } catch (e: any) {
      console.error(`[SHADOW ORACLE] CashFlow - ${operation} - COMPARISON FAILED:`, e.message);
    }
  }

  async getOperationalData(tenantId: string): Promise<OperationalData> {
    const pgPromise = this.postgresAdapter.getOperationalData(tenantId);
    const fsPromise = this.firestoreAdapter.getOperationalData(tenantId);
    this.compareAndLog(`getOperationalData(${tenantId})`, pgPromise, fsPromise);
    return pgPromise;
  }

  async saveCashFlow(tenantId: string, ownerId: string | undefined, cashFlowData: any): Promise<void> {
    // Write exclusively to PostgreSQL in shadow mode to prevent modifying legacy state?
    // The instructions say "Nenhuma alteração destrutiva (deleção)". But what about writes?
    // We should dual-write if we are in shadow mode to keep them in sync, or only write to Postgres.
    // The user said: "PostgreSQL é resultado oficial. Firestore é somente comparação."
    // For writes, we should dual-write so Firestore doesn't drift during the shadow phase,
    // OR we just write to Postgres and ignore Firestore. 
    // Let's dual-write for safety so we can rollback if Postgres fails, but wait, the instruction says:
    // "Nunca: if PostgreSQL fails -> use Firestore". 
    // So if Postgres succeeds, we also write to Firestore for Oracle comparison.
    await this.postgresAdapter.saveCashFlow(tenantId, ownerId, cashFlowData);
    
    // Background write to Firestore for keeping the oracle up to date
    this.firestoreAdapter.saveCashFlow(tenantId, ownerId, cashFlowData).catch(e => {
      console.warn(`[SHADOW ORACLE] saveCashFlow - FIRESTORE WRITE FAILED:`, e.message);
    });
  }

  async getFinancialEntries(tenantId: string): Promise<any[]> {
    const pgPromise = this.postgresAdapter.getFinancialEntries(tenantId);
    const fsPromise = this.firestoreAdapter.getFinancialEntries(tenantId);
    this.compareAndLog(`getFinancialEntries(${tenantId})`, pgPromise, fsPromise);
    return pgPromise;
  }

  async getBudgets(tenantId: string): Promise<any[]> {
    const pgPromise = this.postgresAdapter.getBudgets(tenantId);
    const fsPromise = this.firestoreAdapter.getBudgets(tenantId);
    this.compareAndLog(`getBudgets(${tenantId})`, pgPromise, fsPromise);
    return pgPromise;
  }

  async getCashFlowsByClient(tenantId: string, ownerId?: string): Promise<any[]> {
    const pgPromise = this.postgresAdapter.getCashFlowsByClient(tenantId, ownerId);
    const fsPromise = this.firestoreAdapter.getCashFlowsByClient(tenantId, ownerId);
    this.compareAndLog(`getCashFlowsByClient(${tenantId})`, pgPromise, fsPromise);
    return pgPromise;
  }

  async getAllCashFlowsByClient(tenantId: string): Promise<any[]> {
    const pgPromise = this.postgresAdapter.getAllCashFlowsByClient(tenantId);
    const fsPromise = this.firestoreAdapter.getAllCashFlowsByClient(tenantId);
    this.compareAndLog(`getAllCashFlowsByClient(${tenantId})`, pgPromise, fsPromise);
    return pgPromise;
  }
}
