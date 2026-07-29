import { ExecutiveInsightSummary, ExecutiveInsightsLayer } from '@illumine/executive-insights-layer';
import { ExecutivePageIntelligenceAdapter, ExecutiveAgentActionRegistry, AgentActionMapping } from '@illumine/executive-page-intelligence';

export interface ExecutivePageIntelligenceRuntime {
  readonly pageContext: string;
  readonly activeAgents: string[];
  readonly availableActions: AgentActionMapping[];
  readonly insights: ExecutiveInsightSummary;
  readonly recommendations: string[];
  readonly risks: string[];
  readonly opportunities: string[];
}

export class ExecutiveIntelligenceRuntime {
  public static resolvePageRuntime(
    pageId: string,
    pageType: string,
    userPersona: string
  ): ExecutivePageIntelligenceRuntime {
    const pageCtx = ExecutivePageIntelligenceAdapter.createPageContext(pageId, pageType, userPersona, []);
    const insights = ExecutiveInsightsLayer.renderHeaderSummary(pageId);
    const availableActions = ExecutiveAgentActionRegistry.getAllMappings();

    return {
      pageContext: pageId,
      activeAgents: pageCtx.availableAgents,
      availableActions,
      insights,
      recommendations: insights.recommendedDecisions,
      risks: insights.risks,
      opportunities: insights.opportunities
    };
  }
}
