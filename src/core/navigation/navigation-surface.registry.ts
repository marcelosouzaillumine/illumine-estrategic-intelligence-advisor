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
  { surfaceId: "ceo.growth-governance", capabilityId: "ceo.growth-governance", route: "/executive/workspace/ceo-office/ceo.growth-governance", officeId: "ceo-office" },
  { surfaceId: "ceo.risk-overview", capabilityId: "ceo.risk-overview", route: "/executive/workspace/ceo-office/ceo.risk-overview", officeId: "ceo-office" },
  
  // CFO Office
  { surfaceId: "cfo.financial-performance", capabilityId: "cfo.financial-performance", route: "/executive/workspace/cfo-office/cfo.financial-performance", officeId: "cfo-office" },
  { surfaceId: "cfo.cash-governance", capabilityId: "cfo.cash-governance", route: "/executive/workspace/cfo-office/cfo.cash-governance", officeId: "cfo-office" },
  { surfaceId: "cfo.planning-forecast", capabilityId: "cfo.planning-forecast", route: "/executive/workspace/cfo-office/cfo.planning-forecast", officeId: "cfo-office" },
  { surfaceId: "cfo.working-capital", capabilityId: "cfo.working-capital", route: "/executive/workspace/cfo-office/cfo.working-capital", officeId: "cfo-office" },

  // Commercial Office
  { surfaceId: "commercial.executive-overview", capabilityId: "commercial.executive-overview", route: "/executive/workspace/commercial-office/commercial.executive-overview", officeId: "commercial-office" },
  { surfaceId: "commercial.revenue-governance", capabilityId: "commercial.commercial-performance", route: "/executive/workspace/commercial-office/commercial.revenue-governance", officeId: "commercial-office" },
  { surfaceId: "commercial.pipeline-governance", capabilityId: "commercial.pipeline-governance", route: "/executive/workspace/commercial-office/commercial.pipeline-governance", officeId: "commercial-office" },
  { surfaceId: "commercial.opportunity-management", capabilityId: "commercial.pipeline-governance", route: "/executive/workspace/commercial-office/commercial.opportunity-management", officeId: "commercial-office" },
  { surfaceId: "commercial.customer-governance", capabilityId: "commercial.customer-governance", route: "/executive/workspace/commercial-office/commercial.customer-governance", officeId: "commercial-office" },
  { surfaceId: "commercial.partner-revenue", capabilityId: "commercial.customer-governance", route: "/executive/workspace/commercial-office/commercial.partner-revenue", officeId: "commercial-office" },
  { surfaceId: "commercial.forecast-governance", capabilityId: "commercial.commercial-performance", route: "/executive/workspace/commercial-office/commercial.forecast-governance", officeId: "commercial-office" },

  // Revenue Office
  { surfaceId: "revenue.command-center", capabilityId: "revenue.command-center", route: "/executive/revenue", officeId: "revenue-office" },
  { surfaceId: "revenue.pipeline", capabilityId: "revenue.pipeline", route: "/executive/revenue/pipeline", officeId: "revenue-office" },
  { surfaceId: "revenue.contracts", capabilityId: "revenue.contracts", route: "/executive/revenue/contracts", officeId: "revenue-office" },
  { surfaceId: "revenue.subscriptions", capabilityId: "revenue.subscriptions", route: "/executive/revenue/subscriptions", officeId: "revenue-office" },
  { surfaceId: "revenue.billing", capabilityId: "revenue.billing", route: "/executive/revenue/billing", officeId: "revenue-office" },
  { surfaceId: "revenue.access", capabilityId: "revenue.access", route: "/executive/revenue/access", officeId: "revenue-office" },
  { surfaceId: "revenue.tenants", capabilityId: "revenue.tenants", route: "/executive/revenue/tenants", officeId: "revenue-office" },
  { surfaceId: "revenue.runtime", capabilityId: "revenue.runtime", route: "/executive/revenue/runtime", officeId: "revenue-office" },
  { surfaceId: "revenue.governance", capabilityId: "revenue.governance", route: "/executive/revenue/governance", officeId: "revenue-office" },
  { surfaceId: "revenue.partners", capabilityId: "revenue.partners", route: "/executive/revenue/partners", officeId: "revenue-office" },
  { surfaceId: "revenue.advisors", capabilityId: "revenue.advisors", route: "/executive/revenue/partners/advisors", officeId: "revenue-office" },
  { surfaceId: "revenue.institutions", capabilityId: "revenue.institutions", route: "/executive/revenue/partners/institutions", officeId: "revenue-office" },
  { surfaceId: "revenue.deal-room", capabilityId: "revenue.pipeline", route: "/executive/revenue/deal-room/new", officeId: "revenue-office" },

  // COO Office
  { surfaceId: "coo.executive-overview", capabilityId: "coo.executive-overview", route: "/executive/workspace/coo-office/coo.executive-overview", officeId: "coo-office" },
  { surfaceId: "coo.process-execution", capabilityId: "coo.process-execution", route: "/executive/workspace/coo-office/coo.process-execution", officeId: "coo-office" },
  { surfaceId: "coo.logistics-supply-chain", capabilityId: "coo.logistics-supply-chain", route: "/executive/workspace/coo-office/coo.logistics-supply-chain", officeId: "coo-office" },
  { surfaceId: "coo.procurement-governance", capabilityId: "coo.procurement-governance", route: "/executive/workspace/coo-office/coo.procurement-governance", officeId: "coo-office" },
  { surfaceId: "coo.operational-excellence", capabilityId: "coo.operational-excellence", route: "/executive/workspace/coo-office/coo.operational-excellence", officeId: "coo-office" },

  // People Office
  { surfaceId: "people.executive-overview", capabilityId: "people.executive-overview", route: "/executive/workspace/people-office/people.executive-overview", officeId: "people-office" },
  { surfaceId: "people.workforce-governance", capabilityId: "people.workforce-governance", route: "/executive/workspace/people-office/people.workforce-governance", officeId: "people-office" },
  { surfaceId: "people.culture-engagement", capabilityId: "people.culture-engagement", route: "/executive/workspace/people-office/people.culture-engagement", officeId: "people-office" },
  { surfaceId: "people.leadership-governance", capabilityId: "people.leadership-governance", route: "/executive/workspace/people-office/people.leadership-governance", officeId: "people-office" },
  { surfaceId: "people.people-costs", capabilityId: "people.people-costs", route: "/executive/workspace/people-office/people.people-costs", officeId: "people-office" },
  { surfaceId: "people.learning-development", capabilityId: "people.learning-development", route: "/executive/workspace/people-office/people.learning-development", officeId: "people-office" },
  { surfaceId: "people.organizational-governance", capabilityId: "people.organizational-governance", route: "/executive/workspace/people-office/people.organizational-governance", officeId: "people-office" },

  // Governance Office
  { surfaceId: "governance.executive-overview", capabilityId: "governance.executive-overview", route: "/executive/workspace/governance-office/governance.executive-overview", officeId: "governance-office" },
  { surfaceId: "governance.strategic-alignment", capabilityId: "governance.strategic-alignment", route: "/executive/workspace/governance-office/governance.strategic-alignment", officeId: "governance-office" },
  { surfaceId: "governance.decision-governance", capabilityId: "governance.decision-governance", route: "/executive/workspace/governance-office/governance.decision-governance", officeId: "governance-office" },
  { surfaceId: "governance.board-governance", capabilityId: "governance.board-governance", route: "/executive/workspace/governance-office/governance.board-governance", officeId: "governance-office" },
  { surfaceId: "governance.governance-maturity", capabilityId: "governance.governance-maturity", route: "/executive/workspace/governance-office/governance.governance-maturity", officeId: "governance-office" },

  // Risk & Compliance Office
  { surfaceId: "risk.executive-overview", capabilityId: "risk.executive-overview", route: "/executive/workspace/risk-office/risk.executive-overview", officeId: "risk-office" },
  { surfaceId: "risk.risk-governance", capabilityId: "risk.risk-governance", route: "/executive/workspace/risk-office/risk.risk-governance", officeId: "risk-office" },
  { surfaceId: "risk.enterprise-risk", capabilityId: "risk.enterprise-risk", route: "/executive/workspace/risk-office/risk.enterprise-risk", officeId: "risk-office" },
  { surfaceId: "risk.compliance-governance", capabilityId: "risk.compliance-governance", route: "/executive/workspace/risk-office/risk.compliance-governance", officeId: "risk-office" },
  { surfaceId: "risk.control-maturity", capabilityId: "risk.control-maturity", route: "/executive/workspace/risk-office/risk.control-maturity", officeId: "risk-office" },
  { surfaceId: "risk.audit-governance", capabilityId: "risk.audit-governance", route: "/executive/workspace/risk-office/risk.audit-governance", officeId: "risk-office" },
  { surfaceId: "risk.enterprise-resilience", capabilityId: "risk.enterprise-resilience", route: "/executive/workspace/risk-office/risk.enterprise-resilience", officeId: "risk-office" },

  // Innovation Office
  { surfaceId: "innovation.executive-overview", capabilityId: "innovation.executive-overview", route: "/executive/workspace/innovation-office/innovation.executive-overview", officeId: "innovation-office" },
  { surfaceId: "innovation.innovation-governance", capabilityId: "innovation.innovation-governance", route: "/executive/workspace/innovation-office/innovation.innovation-governance", officeId: "innovation-office" },
  { surfaceId: "innovation.innovation-portfolio", capabilityId: "innovation.innovation-portfolio", route: "/executive/workspace/innovation-office/innovation.innovation-portfolio", officeId: "innovation-office" },
  { surfaceId: "innovation.opportunity-governance", capabilityId: "innovation.opportunity-governance", route: "/executive/workspace/innovation-office/innovation.opportunity-governance", officeId: "innovation-office" },
  { surfaceId: "innovation.experiment-management", capabilityId: "innovation.experiment-management", route: "/executive/workspace/innovation-office/innovation.experiment-management", officeId: "innovation-office" },
  { surfaceId: "innovation.digital-transformation", capabilityId: "innovation.digital-transformation", route: "/executive/workspace/innovation-office/innovation.digital-transformation", officeId: "innovation-office" },
  { surfaceId: "innovation.knowledge-evolution", capabilityId: "innovation.knowledge-evolution", route: "/executive/workspace/innovation-office/innovation.knowledge-evolution", officeId: "innovation-office" },

  // Enterprise Intelligence
  { surfaceId: "governance.preview", capabilityId: "governance.preview", route: "/executive/workspace/governance/governance.preview", officeId: "governance" },

  // Platform Workspace
  { surfaceId: "platform.revenue-center", capabilityId: "PLATFORM_REVENUE_VIEW", route: "/platform/workspace/revenue-center", officeId: "platform-workspace" },
  { surfaceId: "platform.pipeline-governance", capabilityId: "PLATFORM_PIPELINE_MANAGE", route: "/platform/workspace/pipeline-governance", officeId: "platform-workspace" },
  { surfaceId: "platform.partner-center", capabilityId: "PLATFORM_PARTNER_VIEW", route: "/platform/workspace/partner-center", officeId: "platform-workspace" },

  // Administration Workspace
  { surfaceId: "workspace", capabilityId: "PLATFORM_ADMIN_VIEW", route: "/administration/workspace", officeId: "administration" },

  // Mentor Office
  { surfaceId: "mentor.dashboard",  capabilityId: "mentor.dashboard",  route: "/mentor/workspace",          officeId: "mentor-office" },
  { surfaceId: "mentor.mentees",    capabilityId: "mentor.mentees",    route: "/mentor/workspace/mentees",  officeId: "mentor-office" },
  { surfaceId: "mentor.sessions",   capabilityId: "mentor.sessions",   route: "/mentor/workspace/sessions", officeId: "mentor-office" },
  { surfaceId: "mentor.library",    capabilityId: "mentor.library",    route: "/mentor/workspace/library",  officeId: "mentor-office" },

  // Mentee Office
  { surfaceId: "mentee.dashboard",  capabilityId: "mentee.dashboard",  route: "/mentee/workspace",          officeId: "mentee-office" },
  { surfaceId: "mentee.journey",    capabilityId: "mentee.journey",    route: "/mentee/workspace/journey",  officeId: "mentee-office" },
  { surfaceId: "mentee.sessions",   capabilityId: "mentee.sessions",   route: "/mentee/workspace/sessions", officeId: "mentee-office" },
  { surfaceId: "mentee.resources",  capabilityId: "mentee.resources",  route: "/mentee/workspace/resources", officeId: "mentee-office" },

  // Program Admin
  { surfaceId: "program.dashboard", capabilityId: "program.dashboard", route: "/admin/programa",            officeId: "program-admin" },
  { surfaceId: "program.matching",  capabilityId: "program.matching",  route: "/admin/programa/matching",   officeId: "program-admin" },
  { surfaceId: "program.reports",   capabilityId: "program.reports",   route: "/admin/programa/relatorios", officeId: "program-admin" }
];
