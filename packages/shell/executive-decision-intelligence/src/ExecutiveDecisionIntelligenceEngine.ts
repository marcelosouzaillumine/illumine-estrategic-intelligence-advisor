import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';
import { ExecutiveSignalResolver, ExecutiveSignalView } from './ExecutiveSignalResolver';
import { ExecutiveRecommendationResolver, ExecutiveRecommendationView } from './ExecutiveRecommendationResolver';
import { ExecutiveDecisionNarrativeResolver, DecisionNarrativeView } from './ExecutiveDecisionNarrativeResolver';
import { ExecutiveActionResolver, DecisionActionItem } from './ExecutiveActionResolver';

export interface DecisionEngineInput {
  readonly companyId: string;
  readonly companyName?: string;
  readonly userId?: string;
  readonly pageId: string;
  readonly period: string;
  readonly comparisonPeriod?: string;
  readonly financialData?: Record<string, number>;
  readonly previousPeriodFinancialData?: Record<string, number>;
}

export interface ExecutiveDecisionOutput {
  readonly context: ExecutiveDecisionContext;
  readonly signal: ExecutiveSignalView;
  readonly recommendation: ExecutiveRecommendationView;
  readonly narrative: DecisionNarrativeView;
  readonly actions: readonly DecisionActionItem[];
}

export class ExecutiveDecisionIntelligenceEngine {
  public static evaluate(input: DecisionEngineInput | ExecutiveDecisionContext): ExecutiveDecisionOutput {
    const context: ExecutiveDecisionContext = ('financialStatements' in input)
      ? (input as ExecutiveDecisionContext)
      : ExecutiveContextProvider.buildContext({
          companyId: input.companyId,
          companyName: input.companyName,
          pageId: input.pageId,
          period: input.period,
          comparisonPeriod: input.comparisonPeriod,
          financialData: input.financialData,
          previousPeriodFinancialData: input.previousPeriodFinancialData
        });

    return {
      context,
      signal: ExecutiveSignalResolver.resolveSignal(context),
      recommendation: ExecutiveRecommendationResolver.resolveRecommendation(context),
      narrative: ExecutiveDecisionNarrativeResolver.resolveNarrative(context),
      actions: ExecutiveActionResolver.resolveActions(context)
    };
  }
}
