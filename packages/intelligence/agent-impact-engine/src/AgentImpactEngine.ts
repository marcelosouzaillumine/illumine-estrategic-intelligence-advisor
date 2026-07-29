import { Identifier, Money, Currency, Score } from '@illumine/core-primitives';
import { AgentRecommendation } from '@illumine/agent-runtime';

export interface ImpactEstimate {
  readonly recommendationId: Identifier;
  readonly financialImpactValue: Money;
  readonly strategicAlignmentScore: Score;
  readonly operationalEfficiencyGainPct: number;
}

export class AgentImpactEngine {
  public static calculateImpact(recommendation: AgentRecommendation): ImpactEstimate {
    // Estimativa padronizada de impacto econômico e operacional (ADR-025)
    return {
      recommendationId: recommendation.recommendationId,
      financialImpactValue: { amount: 1500000, currency: Currency.BRL },
      strategicAlignmentScore: Score.create(92),
      operationalEfficiencyGainPct: 8.5
    };
  }
}
