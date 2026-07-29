import { ExecutiveSignalResolver, ExecutiveSignalView } from './ExecutiveSignalResolver';
import { ExecutiveRecommendationResolver, ExecutiveRecommendationView } from './ExecutiveRecommendationResolver';
import { ExecutiveDecisionNarrativeResolver, DecisionNarrativeView } from './ExecutiveDecisionNarrativeResolver';
import { ExecutiveActionResolver, DecisionActionItem } from './ExecutiveActionResolver';

export interface DecisionEngineInput {
  readonly companyId: string;
  readonly userId: string;
  readonly pageId: string;
  readonly period: string;
  readonly financialData?: Record<string, number>;
}

export interface ExecutiveDecisionOutput {
  readonly signal: ExecutiveSignalView;
  readonly recommendation: ExecutiveRecommendationView;
  readonly narrative: DecisionNarrativeView;
  readonly actions: readonly DecisionActionItem[];
}

export class ExecutiveDecisionIntelligenceEngine {
  public static evaluate(input: DecisionEngineInput): ExecutiveDecisionOutput {
    return {
      signal: ExecutiveSignalResolver.resolveSignal({ pageId: input.pageId, financialData: input.financialData }),
      recommendation: ExecutiveRecommendationResolver.resolveRecommendation({ pageId: input.pageId }),
      narrative: ExecutiveDecisionNarrativeResolver.resolveNarrative({ pageId: input.pageId, period: input.period }),
      actions: ExecutiveActionResolver.resolveActions({ pageId: input.pageId })
    };
  }
}
