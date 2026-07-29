import { ExecutiveDecisionLayer, DecisionLayerContext, CanonicalDecisionView } from './ExecutiveDecisionLayer';
import { ExecutiveMetricIntelligenceLayer, MetricIntelligenceContext, MetricInsightView } from './ExecutiveMetricIntelligenceLayer';
import { ExecutiveActionLayer, ActionLayerContext, ExecutiveActionView } from './ExecutiveActionLayer';
import { ExecutiveCopilotLayer, CopilotLayerContext, CopilotOpeningView } from './ExecutiveCopilotLayer';

export interface FullComposerContext {
  readonly companyId: string;
  readonly companyName?: string;
  readonly userId: string;
  readonly pageId: string;
  readonly period: string;
  readonly activeMetric?: string;
  readonly activeFinancialMetrics?: Record<string, number>;
}

export interface ComposedExecutiveExperience {
  readonly decisionView: CanonicalDecisionView;
  readonly metricInsights: readonly MetricInsightView[];
  readonly actions: readonly ExecutiveActionView[];
  readonly copilotOpening: CopilotOpeningView;
}

export class ExecutiveExperienceComposer {
  public static compose(ctx: FullComposerContext): ComposedExecutiveExperience {
    const decisionCtx: DecisionLayerContext = {
      companyId: ctx.companyId,
      userId: ctx.userId,
      pageId: ctx.pageId,
      period: ctx.period,
      activeFinancialMetrics: ctx.activeFinancialMetrics
    };

    const metricCtx: MetricIntelligenceContext = {
      pageId: ctx.pageId,
      activeMetric: ctx.activeMetric
    };

    const actionCtx: ActionLayerContext = {
      pageId: ctx.pageId
    };

    const copilotCtx: CopilotLayerContext = {
      companyName: ctx.companyName || 'Empresa',
      pageId: ctx.pageId,
      activeMetric: ctx.activeMetric
    };

    return {
      decisionView: ExecutiveDecisionLayer.resolveDecisionView(decisionCtx),
      metricInsights: ExecutiveMetricIntelligenceLayer.resolveMetricInsights(metricCtx),
      actions: ExecutiveActionLayer.resolveActions(actionCtx),
      copilotOpening: ExecutiveCopilotLayer.resolveInitialCopilotState(copilotCtx)
    };
  }
}
