import { Identifier, Score } from '@illumine/core-primitives';

export interface DecisionExplanation {
  readonly explanationId: Identifier;
  readonly why: string;
  readonly keyIndicators: string[];
  readonly participatingModels: string[];
  readonly participatingAgents: string[];
  readonly assumptionsAdopted: string[];
  readonly risksConsidered: string[];
  readonly discardedAlternatives: string[];
  readonly confidenceScore: Score;
  readonly historicalMatches: string[];
}

export class ExecutiveExplainabilityCenter {
  public static explainDecision(
    whyText: string,
    indicators: string[],
    agents: string[],
    assumptions: string[]
  ): DecisionExplanation {
    return {
      explanationId: `exp-${Date.now()}`,
      why: whyText,
      keyIndicators: indicators,
      participatingModels: ['FinancialModelingPrep', 'MonteCarloSim'],
      participatingAgents: agents,
      assumptionsAdopted: assumptions,
      risksConsidered: ['Risco de liquidez', 'Variação cambial'],
      discardedAlternatives: ['Diferimento de investimento', 'Desinvestimento de ativo'],
      confidenceScore: Score.create(95),
      historicalMatches: ['decision-hist-2024-q3']
    };
  }
}
