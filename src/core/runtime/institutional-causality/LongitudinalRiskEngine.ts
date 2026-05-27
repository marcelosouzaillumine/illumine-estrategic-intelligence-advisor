import { HistoricalCycleData } from '../institutional-memory/types';
import { LongitudinalRiskPattern, CycleMetrics } from './types';

export class LongitudinalRiskEngine {
  public static detect(cycles: HistoricalCycleData[], metrics: CycleMetrics[]): LongitudinalRiskPattern[] {
    if (cycles.length < 3) return [];

    const patterns: LongitudinalRiskPattern[] = [];
    const n = metrics.length;

    // A. Redução gradual de liquidez
    let liqDecreasing = true;
    for (let i = 1; i < n; i++) {
      if (metrics[i].liqCorrente >= metrics[i - 1].liqCorrente) {
        liqDecreasing = false;
        break;
      }
    }
    if (liqDecreasing && n >= 3) {
      patterns.push({
        patternId: 'PAT-LIQ-DECLINE',
        description: 'Redução gradual da liquidez corrente observada nos últimos ciclos.',
        metricAnalyzed: 'Liquidez Corrente',
        progressionTrend: 'DETERIORATING',
        observedCycles: n
      });
    }

    // B. Aumento de capital improdutivo (estoques + clientes)
    let nwcImprodutivoIncreasing = true;
    for (let i = 1; i < n; i++) {
      const prevSum = metrics[i - 1].estoques + metrics[i - 1].clientes;
      const currSum = metrics[i].estoques + metrics[i].clientes;
      if (currSum <= prevSum) {
        nwcImprodutivoIncreasing = false;
        break;
      }
    }
    if (nwcImprodutivoIncreasing && n >= 3) {
      patterns.push({
        patternId: 'PAT-IMPRODUTIVO-GROWTH',
        description: 'Aumento recorrente de capital improdutivo (estoques e recebíveis) sob regime de persistência.',
        metricAnalyzed: 'Capital Improdutivo',
        progressionTrend: 'DETERIORATING',
        observedCycles: n
      });
    }

    // C. Crescimento operacional sem reforço patrimonial
    let operationalGrowthWithoutEquity = true;
    for (let i = 1; i < n; i++) {
      const stockGrows = metrics[i].estoques > metrics[i - 1].estoques * 1.05;
      const plStable = metrics[i].patrimonioLiquido <= metrics[i - 1].patrimonioLiquido * 1.05;
      if (!stockGrows || !plStable) {
        operationalGrowthWithoutEquity = false;
        break;
      }
    }
    if (operationalGrowthWithoutEquity && n >= 3) {
      patterns.push({
        patternId: 'PAT-GROWTH-NO-EQUITY',
        description: 'Crescimento operacional sem reforço patrimonial proporcional em ciclos sucessivos.',
        metricAnalyzed: 'Patrimônio Líquido vs Estoques',
        progressionTrend: 'DETERIORATING',
        observedCycles: n
      });
    }

    // D. Recorrência de compressão de margem / score
    let scoreDecreasing = true;
    for (let i = 1; i < n; i++) {
      if (metrics[i].compositeScore >= metrics[i - 1].compositeScore) {
        scoreDecreasing = false;
        break;
      }
    }
    if (scoreDecreasing && n >= 3) {
      patterns.push({
        patternId: 'PAT-SCORE-COMPRESSION',
        description: 'Recorrência de compressão de margem e desempenho operacional refletida no declínio dos indicadores.',
        metricAnalyzed: 'Score Composto',
        progressionTrend: 'DETERIORATING',
        observedCycles: n
      });
    }

    return patterns;
  }
}
