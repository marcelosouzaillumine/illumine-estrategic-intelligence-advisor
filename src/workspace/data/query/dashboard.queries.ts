import { RepositoryFactory } from '../factory/repository.factory';

/**
 * DashboardQueries aggregates data across multiple repositories
 * for composite dashboard views.
 */
export class DashboardQueries {
  static async getExecutiveDashboardOverview(tenantId: string, periodId: string) {
    const financialRepo = RepositoryFactory.getFinancialRepository();
    const snapshotRepo = RepositoryFactory.getSnapshotRepository();

    const [financial, snapshot] = await Promise.all([
      financialRepo.getFinancialData({ tenantId, periodId }),
      snapshotRepo.listSnapshots({ tenantId, periodId, limit: 1 })
    ]);

    return {
      financial,
      latestSnapshot: snapshot[0] || null
    };
  }
}
