import { ExecutivePageIntelligenceContext } from './PageIntelligenceContext';
import { PageIntelligenceCapabilities, PageCapabilities } from './PageAgentResolver';
import { PageAgentResolver } from './PageAgentResolver';

export class ExecutivePageIntelligenceAdapter {
  public static createPageContext(
    pageId: string,
    pageType: string,
    userPersona: string,
    activeKpis: string[]
  ): ExecutivePageIntelligenceContext {
    const availableAgents = PageAgentResolver.resolveAgentsForPage(pageType);
    return {
      pageId,
      pageType,
      businessContext: `Contexto executivo ativado para ${pageId}`,
      selectedPeriod: '2026-YTD',
      activeFilters: { page: pageId },
      activeKpis,
      availableAgents,
      availableEngines: ['ExecutiveInsightEngine', 'ExecutivePriorityEngine', 'AgentDebateEngine'],
      userPersona
    };
  }

  public static getPageCapabilities(pageId: string): PageCapabilities {
    return PageIntelligenceCapabilities.getCapabilitiesForPage(pageId);
  }
}
