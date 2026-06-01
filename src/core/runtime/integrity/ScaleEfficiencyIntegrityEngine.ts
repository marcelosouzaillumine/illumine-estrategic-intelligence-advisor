import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { ExecutiveEmptyStateResolver } from './ExecutiveEmptyStateResolver';

export class ScaleEfficiencyIntegrityEngine {
  public static evaluate(historicalCycles: number): boolean {
    return historicalCycles < 2;
  }

  public static applyFailClosed(report: ExecutiveIntelligenceReport): ExecutiveIntelligenceReport {
    if (!report.metrics) return report;

    const msg = ExecutiveEmptyStateResolver.resolve('INSUFFICIENT_HISTORY');

    return {
      ...report,
      metrics: {
        ...report.metrics,
        scaleEfficiency: {
          category: 'NOT_AVAILABLE',
          colorClass: 'text-slate-400',
          recGrowth: null as unknown as number,
          ebitdaGrowth: null as unknown as number,
          description: msg
        }
      }
    };
  }
}
