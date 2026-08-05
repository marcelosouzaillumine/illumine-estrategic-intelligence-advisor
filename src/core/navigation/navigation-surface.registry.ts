export interface NavigationSurfaceDefinition {
  surfaceId: string;
  capabilityId: string;
  route: string;
  officeId?: string;
  permission?: string;
}

export const NAVIGATION_SURFACE_REGISTRY: NavigationSurfaceDefinition[] = [
  // CEO Office
  { surfaceId: "ceo.executive-overview", capabilityId: "ceo.executive-overview", route: "/executive/workspace/ceo-office/ceo.executive-overview", officeId: "ceo-office" },
  { surfaceId: "ceo.strategic-performance", capabilityId: "ceo.strategic-performance", route: "/executive/workspace/ceo-office/ceo.strategic-performance", officeId: "ceo-office" },
  { surfaceId: "ceo.growth-intelligence", capabilityId: "ceo.growth-intelligence", route: "/executive/workspace/ceo-office/ceo.growth-intelligence", officeId: "ceo-office" },
  { surfaceId: "ceo.risk-overview", capabilityId: "ceo.risk-overview", route: "/executive/workspace/ceo-office/ceo.risk-overview", officeId: "ceo-office" },
  
  // CFO Office
  { surfaceId: "cfo.financial-performance", capabilityId: "cfo.financial-performance", route: "/executive/workspace/cfo-office/cfo.financial-performance", officeId: "cfo-office" },
  { surfaceId: "cfo.cash-intelligence", capabilityId: "cfo.cash-intelligence", route: "/executive/workspace/cfo-office/cfo.cash-intelligence", officeId: "cfo-office" },
  { surfaceId: "cfo.planning-forecast", capabilityId: "cfo.planning-forecast", route: "/executive/workspace/cfo-office/cfo.planning-forecast", officeId: "cfo-office" },
  { surfaceId: "cfo.working-capital", capabilityId: "cfo.working-capital", route: "/executive/workspace/cfo-office/cfo.working-capital", officeId: "cfo-office" },

  // Commercial Office
  { surfaceId: "commercial.executive-overview", capabilityId: "commercial.executive-overview", route: "/executive/workspace/commercial-office/commercial.executive-overview", officeId: "commercial-office" },
  { surfaceId: "commercial.revenue-intelligence", capabilityId: "commercial.commercial-performance", route: "/executive/workspace/commercial-office/commercial.revenue-intelligence", officeId: "commercial-office" },
  { surfaceId: "commercial.pipeline-intelligence", capabilityId: "commercial.pipeline-intelligence", route: "/executive/workspace/commercial-office/commercial.pipeline-intelligence", officeId: "commercial-office" },
  { surfaceId: "commercial.opportunity-management", capabilityId: "commercial.pipeline-intelligence", route: "/executive/workspace/commercial-office/commercial.opportunity-management", officeId: "commercial-office" },
  { surfaceId: "commercial.customer-intelligence", capabilityId: "commercial.customer-intelligence", route: "/executive/workspace/commercial-office/commercial.customer-intelligence", officeId: "commercial-office" },
  { surfaceId: "commercial.partner-revenue", capabilityId: "commercial.customer-intelligence", route: "/executive/workspace/commercial-office/commercial.partner-revenue", officeId: "commercial-office" },
  { surfaceId: "commercial.forecast-intelligence", capabilityId: "commercial.commercial-performance", route: "/executive/workspace/commercial-office/commercial.forecast-intelligence", officeId: "commercial-office" },

  // Revenue Office
  { surfaceId: "revenue.command-center", capabilityId: "revenue.command-center", route: "/executive/revenue", officeId: "revenue-office" },
  { surfaceId: "revenue.pipeline", capabilityId: "revenue.pipeline", route: "/executive/revenue/pipeline", officeId: "revenue-office" },
  { surfaceId: "revenue.contracts", capabilityId: "revenue.contracts", route: "/executive/revenue/contracts", officeId: "revenue-office" },
  { surfaceId: "revenue.subscriptions", capabilityId: "revenue.subscriptions", route: "/executive/revenue/subscriptions", officeId: "revenue-office" },
  { surfaceId: "revenue.billing", capabilityId: "revenue.billing", route: "/executive/revenue/billing", officeId: "revenue-office" },
  { surfaceId: "revenue.access", capabilityId: "revenue.access", route: "/executive/revenue/access", officeId: "revenue-office" },
  { surfaceId: "revenue.tenants", capabilityId: "revenue.tenants", route: "/executive/revenue/tenants", officeId: "revenue-office" },
  { surfaceId: "revenue.runtime", capabilityId: "revenue.runtime", route: "/executive/revenue/runtime", officeId: "revenue-office" },
  { surfaceId: "revenue.intelligence", capabilityId: "revenue.intelligence", route: "/executive/revenue/intelligence", officeId: "revenue-office" },
  { surfaceId: "revenue.partners", capabilityId: "revenue.partners", route: "/executive/revenue/partners", officeId: "revenue-office" },
  { surfaceId: "revenue.advisors", capabilityId: "revenue.advisors", route: "/executive/revenue/partners/advisors", officeId: "revenue-office" },
  { surfaceId: "revenue.institutions", capabilityId: "revenue.institutions", route: "/executive/revenue/partners/institutions", officeId: "revenue-office" },
  { surfaceId: "revenue.deal-room", capabilityId: "revenue.pipeline", route: "/executive/revenue/deal-room/new", officeId: "revenue-office" },

  // COO Office
  { surfaceId: "coo.executive-overview", capabilityId: "coo.executive-overview", route: "/executive/workspace/coo-office/coo.executive-overview", officeId: "coo-office" },
  { surfaceId: "coo.process-execution", capabilityId: "coo.process-execution", route: "/executive/workspace/coo-office/coo.process-execution", officeId: "coo-office" },
  { surfaceId: "coo.logistics-supply-chain", capabilityId: "coo.logistics-supply-chain", route: "/executive/workspace/coo-office/coo.logistics-supply-chain", officeId: "coo-office" },
  { surfaceId: "coo.procurement-intelligence", capabilityId: "coo.procurement-intelligence", route: "/executive/workspace/coo-office/coo.procurement-intelligence", officeId: "coo-office" },
  { surfaceId: "coo.operational-excellence", capabilityId: "coo.operational-excellence", route: "/executive/workspace/coo-office/coo.operational-excellence", officeId: "coo-office" },

  // People Office
  { surfaceId: "people.executive-overview", capabilityId: "people.executive-overview", route: "/executive/workspace/people-office/people.executive-overview", officeId: "people-office" },
  { surfaceId: "people.workforce-intelligence", capabilityId: "people.workforce-intelligence", route: "/executive/workspace/people-office/people.workforce-intelligence", officeId: "people-office" },
  { surfaceId: "people.culture-engagement", capabilityId: "people.culture-engagement", route: "/executive/workspace/people-office/people.culture-engagement", officeId: "people-office" },
  { surfaceId: "people.leadership-intelligence", capabilityId: "people.leadership-intelligence", route: "/executive/workspace/people-office/people.leadership-intelligence", officeId: "people-office" },
  { surfaceId: "people.people-costs", capabilityId: "people.people-costs", route: "/executive/workspace/people-office/people.people-costs", officeId: "people-office" },
  { surfaceId: "people.learning-development", capabilityId: "people.learning-development", route: "/executive/workspace/people-office/people.learning-development", officeId: "people-office" },
  { surfaceId: "people.organizational-intelligence", capabilityId: "people.organizational-intelligence", route: "/executive/workspace/people-office/people.organizational-intelligence", officeId: "people-office" },

  // Governance Office
  { surfaceId: "governance.executive-overview", capabilityId: "governance.executive-overview", route: "/executive/workspace/governance-office/governance.executive-overview", officeId: "governance-office" },
  { surfaceId: "governance.strategic-alignment", capabilityId: "governance.strategic-alignment", route: "/executive/workspace/governance-office/governance.strategic-alignment", officeId: "governance-office" },
  { surfaceId: "governance.decision-intelligence", capabilityId: "governance.decision-intelligence", route: "/executive/workspace/governance-office/governance.decision-intelligence", officeId: "governance-office" },
  { surfaceId: "governance.board-intelligence", capabilityId: "governance.board-intelligence", route: "/executive/workspace/governance-office/governance.board-intelligence", officeId: "governance-office" },
  { surfaceId: "governance.governance-maturity", capabilityId: "governance.governance-maturity", route: "/executive/workspace/governance-office/governance.governance-maturity", officeId: "governance-office" },

  // Risk & Compliance Office
  { surfaceId: "risk.executive-overview", capabilityId: "risk.executive-overview", route: "/executive/workspace/risk-office/risk.executive-overview", officeId: "risk-office" },
  { surfaceId: "risk.risk-intelligence", capabilityId: "risk.risk-intelligence", route: "/executive/workspace/risk-office/risk.risk-intelligence", officeId: "risk-office" },
  { surfaceId: "risk.enterprise-risk", capabilityId: "risk.enterprise-risk", route: "/executive/workspace/risk-office/risk.enterprise-risk", officeId: "risk-office" },
  { surfaceId: "risk.compliance-intelligence", capabilityId: "risk.compliance-intelligence", route: "/executive/workspace/risk-office/risk.compliance-intelligence", officeId: "risk-office" },
  { surfaceId: "risk.control-maturity", capabilityId: "risk.control-maturity", route: "/executive/workspace/risk-office/risk.control-maturity", officeId: "risk-office" },
  { surfaceId: "risk.audit-intelligence", capabilityId: "risk.audit-intelligence", route: "/executive/workspace/risk-office/risk.audit-intelligence", officeId: "risk-office" },
  { surfaceId: "risk.enterprise-resilience", capabilityId: "risk.enterprise-resilience", route: "/executive/workspace/risk-office/risk.enterprise-resilience", officeId: "risk-office" },

  // Innovation Office
  { surfaceId: "innovation.executive-overview", capabilityId: "innovation.executive-overview", route: "/executive/workspace/innovation-office/innovation.executive-overview", officeId: "innovation-office" },
  { surfaceId: "innovation.innovation-intelligence", capabilityId: "innovation.innovation-intelligence", route: "/executive/workspace/innovation-office/innovation.innovation-intelligence", officeId: "innovation-office" },
  { surfaceId: "innovation.innovation-portfolio", capabilityId: "innovation.innovation-portfolio", route: "/executive/workspace/innovation-office/innovation.innovation-portfolio", officeId: "innovation-office" },
  { surfaceId: "innovation.opportunity-intelligence", capabilityId: "innovation.opportunity-intelligence", route: "/executive/workspace/innovation-office/innovation.opportunity-intelligence", officeId: "innovation-office" },
  { surfaceId: "innovation.experiment-management", capabilityId: "innovation.experiment-management", route: "/executive/workspace/innovation-office/innovation.experiment-management", officeId: "innovation-office" },
  { surfaceId: "innovation.digital-transformation", capabilityId: "innovation.digital-transformation", route: "/executive/workspace/innovation-office/innovation.digital-transformation", officeId: "innovation-office" },
  { surfaceId: "innovation.knowledge-evolution", capabilityId: "innovation.knowledge-evolution", route: "/executive/workspace/innovation-office/innovation.knowledge-evolution", officeId: "innovation-office" },

  // Enterprise Intelligence
  { surfaceId: "intelligence.preview", capabilityId: "intelligence.preview", route: "/executive/workspace/intelligence/intelligence.preview", officeId: "intelligence" },

  // Platform Workspace
  { surfaceId: "platform.revenue-center", capabilityId: "PLATFORM_REVENUE_VIEW", route: "/platform/workspace/revenue-center", officeId: "platform-workspace" },
  { surfaceId: "platform.pipeline-intelligence", capabilityId: "PLATFORM_PIPELINE_MANAGE", route: "/platform/workspace/pipeline-intelligence", officeId: "platform-workspace" },
  { surfaceId: "platform.partner-center", capabilityId: "PLATFORM_PARTNER_VIEW", route: "/platform/workspace/partner-center", officeId: "platform-workspace" },

  // Administration Workspace
  { surfaceId: "workspace", capabilityId: "PLATFORM_ADMIN_VIEW", route: "/administration/workspace", officeId: "administration" }
];
