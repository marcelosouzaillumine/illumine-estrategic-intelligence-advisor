export interface PageCapabilities {
  readonly hasInsightsHeader: boolean;
  readonly hasDrawer: boolean;
  readonly hasPageQuestions: boolean;
  readonly hasKpiTriggers: boolean;
  readonly hasCopilot: boolean;
}

export class PageIntelligenceCapabilities {
  public static getCapabilitiesForPage(pageId: string): PageCapabilities {
    return {
      hasInsightsHeader: true,
      hasDrawer: true,
      hasPageQuestions: true,
      hasKpiTriggers: true,
      hasCopilot: true
    };
  }
}

export class PageAgentResolver {
  public static resolveAgentsForPage(pageType: string): string[] {
    switch (pageType.toUpperCase()) {
      case 'FINANCIAL':
      case 'DRE':
      case 'BP':
      case 'DFC':
      case 'DLPA':
      case 'EFOS':
        return ['cfo-intelligence-agent', 'controller-agent', 'financial-risk-agent'];
      case 'STRATEGIC':
      case 'DASHBOARD':
        return ['ceo-strategic-agent', 'cfo-intelligence-agent', 'advisory-council-agent'];
      default:
        return ['executive-orchestrator-agent'];
    }
  }
}
