import { CounterfactualContract } from '@illumine/executive-contracts';

export class CounterfactualAnalysisEngine {
  public static analyzeSensitivity(metricCode: string, baseValue: number, counterfactualValue: number): CounterfactualContract {
    const delta = Number((counterfactualValue - baseValue).toFixed(1));
    const wouldChange = Math.abs(delta) >= 2.0;

    return {
      analysisId: `cf-${metricCode}-${Date.now()}`,
      baseMetricCode: metricCode,
      baseValue,
      counterfactualValue,
      deltaDeltaPoints: delta,
      wouldDecisionChange: wouldChange,
      alteredCouncilRecommendation: wouldChange ? 'Se a margem EBITDA estivesse 2.0 p.p. acima, o Conselho recomendaria reinvestimento imediato em expansão em vez de desalavancagem.' : 'Recomendação inalterada.',
      sensitiveVariable: metricCode
    };
  }
}
