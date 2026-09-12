export interface ExecutivePageIntelligenceContext {
  readonly pageId: string;
  readonly pageType: string;
  readonly businessContext: string;
  readonly selectedPeriod: string;
  readonly activeFilters: Record<string, string>;
  readonly activeKpis: string[];
  readonly availableAgents: string[];
  readonly availableEngines: string[];
  readonly userPersona: string;
}
