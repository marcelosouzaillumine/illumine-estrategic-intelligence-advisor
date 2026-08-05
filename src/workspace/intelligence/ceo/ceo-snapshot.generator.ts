import { ExecutiveContext } from '../../context/executive-context.types';
import { ProviderFactory } from '../../data/factory/provider.factory';

/**
 * Aggregates intelligence from all operational offices to generate a high-level CEO snapshot.
 */
export class CeoSnapshotGenerator {
  async generateSnapshot(context: ExecutiveContext) {
    console.log(`[CEO Snapshot Generator] Generating snapshot for ${context.period.year}-${context.period.month}`);
    
    const ceoProvider = ProviderFactory.getCeoProvider('mock');
    
    // In a real implementation, this generator would invoke CFO, COO, Commercial engines 
    // to build the 'CeoExecutiveSummaryData', but for now the CEO engines mock this synthesis.
    
    const summary = await ceoProvider.getExecutiveSummary(context);
    const strategy = await ceoProvider.getStrategicPerformance(context);
    
    return {
      metadata: summary.metadata,
      overallHealthScore: summary.overallHealthScore,
      strategyStatus: strategy.businessEvolution.score,
      criticalInsights: summary.criticalInsights,
      decisionsRequired: summary.decisionsRequired
    };
  }
}
