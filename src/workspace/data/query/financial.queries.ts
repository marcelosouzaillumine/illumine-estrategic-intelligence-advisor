import { RepositoryFactory } from '../factory/repository.factory';
import { FinancialDataQueryOptions } from '../contracts/financial.repository';

/**
 * FinancialQueries coordinates access to the FinancialRepository,
 * transforming repository-level models into the exact structures 
 * expected by the Intelligence Providers.
 */
export class FinancialQueries {
  static async getExecutivePerformanceMetrics(tenantId: string, periodId: string) {
    const repository = RepositoryFactory.getFinancialRepository();
    const data = await repository.getFinancialData({
      tenantId,
      periodId,
      type: 'actual'
    });

    // Translate data into domain metrics
    return {
      revenue: data?.revenue || 0,
      ebitda: data?.ebitda || 0,
      margin: data?.margin || 0,
    };
  }

  static async getCashFlowForecast(tenantId: string, periodId: string) {
    const repository = RepositoryFactory.getFinancialRepository();
    const data = await repository.getFinancialData({
      tenantId,
      periodId,
      type: 'forecast'
    });

    return {
      forecast: data?.forecast || {},
      runwayDays: data?.runwayDays || 0
    };
  }
}
