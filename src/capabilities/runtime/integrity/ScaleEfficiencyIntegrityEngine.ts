import { ExecutiveIntelligenceReport } from '../../../core/runtime/executive-intelligence-runtime';
import { ExecutiveEmptyStateResolver } from './ExecutiveEmptyStateResolver';

export class ScaleEfficiencyIntegrityEngine {
  public static evaluate(historicalCycles: number): boolean {
    return historicalCycles < 2;
  }

  public static applyFailClosed(report: ExecutiveIntelligenceReport): ExecutiveIntelligenceReport {
    if (!report.metrics) return report;

    const msg = "A organização possui apenas um exercício auditável disponível, impossibilitando análises consistentes de crescimento, ganho de escala ou estabilidade operacional.";

    return {
      ...report,
      metrics: {
        ...report.metrics,
        scaleEfficiency: {
          category: 'Base Histórica Insuficiente',
          colorClass: 'text-muted-foreground',
          recGrowth: null as unknown as number,
          ebitdaGrowth: null as unknown as number,
          description: msg
        }
      }
    };
  }
}
