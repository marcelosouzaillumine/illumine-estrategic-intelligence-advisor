import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { ExecutiveEmptyStateResolver } from './ExecutiveEmptyStateResolver';

export class HistoricalSeriesIntegrityEngine {
  public static validate(chartData: any[]): boolean {
    if (!chartData || !Array.isArray(chartData)) {
      return false;
    }
    // A point is valid if it has positive revenue or ebitda or profit
    const validPoints = chartData.filter((point) => {
      const year = Number(point.year);
      const hasData = point.receita > 0 || Math.abs(point.ebitda) > 0 || Math.abs(point.lucro) > 0 || point.cmv > 0;
      return !isNaN(year) && hasData;
    });

    return validPoints.length >= 2;
  }

  public static applyFailClosed(report: ExecutiveIntelligenceReport): ExecutiveIntelligenceReport {
    const msg = ExecutiveEmptyStateResolver.resolve('INSUFFICIENT_HISTORY');
    if (!report.metrics) return report;

    return {
      ...report,
      metrics: {
        ...report.metrics,
        chartData: [],
        scaleEfficiency: {
          category: 'NOT_AVAILABLE',
          colorClass: 'text-muted-foreground',
          recGrowth: null as unknown as number,
          ebitdaGrowth: null as unknown as number,
          description: msg
        }
      },
      // Append warning to advisory executive summary
      advisory: {
        ...report.advisory,
        executiveSummary: report.advisory.executiveSummary + ` ${msg}`
      }
    };
  }
}
