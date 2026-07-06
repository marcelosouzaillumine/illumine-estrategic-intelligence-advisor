import { BPSummary } from '../../../../lib/bpEngine';
import { BalanceSheetFinancialMetricsEngine, PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';

export type TrendDirection = 'IMPROVING' | 'STABLE' | 'DETERIORATING' | 'VOLATILE' | 'PARTIAL_HISTORY' | 'INSUFFICIENT_HISTORICAL_DATA';

export interface TrendData {
  metricName: string;
  history: { year: number; value: number | 'INSUFFICIENT_DATA' }[];
  trend: TrendDirection;
}

export interface PatrimonialTrendOutput {
  trends: TrendData[];
  rationale: string;
  confidence: number;
  lineageHash: string;
  sourceRuntime: string;
}

export class PatrimonialTrendEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  private static TARGET_METRICS = [
    'Liquidez Corrente',
    'Liquidez Seca',
    'Liquidez Geral',
    'Endividamento Geral',
    'Necessidade de Capital de Giro',
    'Capital de Giro Líquido',
    'Saldo de Tesouraria',
    'Autonomia Financeira'
  ];

  public static analyzeTrend(history: { year: number; summary: BPSummary }[]): PatrimonialTrendOutput {
    // Sort ascending by year
    const sortedHistory = [...history].sort((a, b) => a.year - b.year);

    if (sortedHistory.length < 2) {
      return {
        trends: [],
        rationale: 'Menos de 2 exercícios disponíveis para inferência de tendência longitudinal.',
        confidence: 0,
        lineageHash: 'PTE-' + Date.now().toString(16).toUpperCase(),
        sourceRuntime: 'BP_RUNTIME'
      };
    }

    const calculatedYears = sortedHistory.map(h => ({
      year: h.year,
      indicators: BalanceSheetFinancialMetricsEngine.calculateIndicators(h.summary)
    }));

    const trends: TrendData[] = this.TARGET_METRICS.map(metric => {
      const metricHistory = calculatedYears.map(cy => {
        const ind = cy.indicators.find(i => i.metricName === metric);
        return {
          year: cy.year,
          value: ind ? ind.value : 'INSUFFICIENT_DATA'
        };
      });

      const validValues = metricHistory.filter(m => m.value !== 'INSUFFICIENT_DATA') as { year: number; value: number }[];
      
      let trend: TrendDirection = 'INSUFFICIENT_HISTORICAL_DATA';
      
      if (validValues.length === 0) {
        trend = 'INSUFFICIENT_HISTORICAL_DATA';
      } else if (validValues.length < metricHistory.length) {
        trend = 'PARTIAL_HISTORY';
      } else {
        const values = validValues.map(v => v.value);
        let increasing = 0;
        let decreasing = 0;
        
        for (let i = 1; i < values.length; i++) {
          if (values[i] > values[i - 1] * 1.05) increasing++;
          else if (values[i] < values[i - 1] * 0.95) decreasing++;
        }

        // Check if higher is better based on the metric. 
        // Liquidez, CGL, Saldo Tesouraria, Autonomia = higher is better
        // Endividamento, NCG = lower is better (usually, though NCG depends on context, but let's assume lower is better for simplified structural analysis, actually NCG isn't simply better lower, but we will classify based on increasing/decreasing vs better).
        const higherIsBetter = ['Liquidez Corrente', 'Liquidez Seca', 'Liquidez Geral', 'Capital de Giro Líquido', 'Saldo de Tesouraria', 'Autonomia Financeira'].includes(metric);

        if (increasing > 0 && decreasing === 0) {
          trend = higherIsBetter ? 'IMPROVING' : 'DETERIORATING';
        } else if (decreasing > 0 && increasing === 0) {
          trend = higherIsBetter ? 'DETERIORATING' : 'IMPROVING';
        } else if (increasing > 0 && decreasing > 0) {
          trend = 'VOLATILE';
        } else {
          trend = 'STABLE';
        }
      }

      return {
        metricName: metric,
        history: metricHistory,
        trend
      } as TrendData;
    });

    return {
      trends,
      rationale: `Análise longitudinal de ${sortedHistory.length} exercícios identificando consistência, deterioração ou estabilidade.`,
      confidence: 100,
      lineageHash: 'PTE-' + Date.now().toString(16).toUpperCase(),
      sourceRuntime: 'BP_RUNTIME'
    };
  }
}
