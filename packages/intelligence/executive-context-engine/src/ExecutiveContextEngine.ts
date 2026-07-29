import { Identifier } from '@illumine/core-primitives';

export interface ExecutiveIntelligenceContext {
  readonly contextId: Identifier;
  readonly userPersona: string;
  readonly currentPage: string;
  readonly activeDomain: string;
  readonly visibleKpis: string[];
  readonly activeDecisionId?: Identifier;
  readonly relevantAgentIds: string[];
}

export class ExecutiveContextEngine {
  public static resolveContext(
    userPersona: string,
    currentPage: string,
    activeDomain: string,
    visibleKpis: string[]
  ): ExecutiveIntelligenceContext {
    return {
      contextId: `ctx-${Date.now()}`,
      userPersona,
      currentPage,
      activeDomain,
      visibleKpis,
      relevantAgentIds: ['cfo-intelligence-agent', 'executive-decision-agent']
    };
  }
}
