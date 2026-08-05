export interface RevenueCapability {
  id: string;
  route: string;
  capability: string;
  requiredRole: string[];
  title: string;
}

export const RevenueCapabilityRegistry: Record<string, RevenueCapability> = {
  commandCenter: {
    id: "revenue.command-center",
    route: "/executive/revenue",
    capability: "REVENUE_INTELLIGENCE",
    requiredRole: ["CEO", "CRO"],
    title: "Command Center"
  },
  pipeline: {
    id: "revenue.pipeline",
    route: "/executive/revenue/pipeline",
    capability: "COMMERCIAL_MANAGEMENT",
    requiredRole: ["CEO", "CRO", "VP_SALES"],
    title: "Commercial Pipeline"
  },
  contracts: {
    id: "revenue.contracts",
    route: "/executive/revenue/contracts",
    capability: "CONTRACT_GOVERNANCE",
    requiredRole: ["CEO", "CRO", "LEGAL"],
    title: "Contract Management"
  },
  subscriptions: {
    id: "revenue.subscriptions",
    route: "/executive/revenue/subscriptions",
    capability: "RECURRING_REVENUE",
    requiredRole: ["CEO", "CRO", "FINANCE"],
    title: "Subscription Intelligence"
  },
  billing: {
    id: "revenue.billing",
    route: "/executive/revenue/billing",
    capability: "FINANCIAL_OPERATIONS",
    requiredRole: ["CFO", "FINANCE"],
    title: "Billing Operations"
  },
  access: {
    id: "revenue.access",
    route: "/executive/revenue/access",
    capability: "ENTITLEMENT_CONTROL",
    requiredRole: ["CRO", "COO"],
    title: "License & Entitlement"
  },
  tenants: {
    id: "revenue.tenants",
    route: "/executive/revenue/tenants",
    capability: "PROVISIONING_GOVERNANCE",
    requiredRole: ["COO", "CTO"],
    title: "Tenant Provisioning"
  },
  runtime: {
    id: "revenue.runtime",
    route: "/executive/revenue/runtime",
    capability: "SYSTEM_OBSERVABILITY",
    requiredRole: ["COO", "CTO"],
    title: "Runtime Operations"
  },
  partners: {
    id: "revenue.partners",
    route: "/executive/revenue/partners",
    capability: "ECOSYSTEM_MANAGEMENT",
    requiredRole: ["CEO", "CRO", "VP_PARTNERS"],
    title: "Partner Network"
  },
  intelligence: {
    id: "revenue.intelligence",
    route: "/executive/revenue/intelligence",
    capability: "DECISION_INTELLIGENCE",
    requiredRole: ["CEO", "CRO"],
    title: "Intelligence Center"
  }
};
