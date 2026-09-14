import { CommercialTier, DeploymentGovernanceLevel } from './CommercialReadinessTypes';

const SAAS_LEVEL: DeploymentGovernanceLevel = {
  mode: 'SHARED_SAAS',
  isolation: 'LOGICAL',
  governance: 'STANDARD'
};

const DEDICATED_TENANT_LEVEL: DeploymentGovernanceLevel = {
  mode: 'DEDICATED_TENANT',
  isolation: 'STRONG_LOGICAL',
  governance: 'ENHANCED'
};

const DEDICATED_INFRA_LEVEL: DeploymentGovernanceLevel = {
  mode: 'DEDICATED_INFRA',
  isolation: 'PHYSICAL_INFRA',
  governance: 'SOVEREIGN'
};

const REGISTRY: Record<string, CommercialTier> = {
  BASIC: {
    tierId: 'TIER-BASIC',
    name: 'BASIC',
    basePrice: 2000,
    features: ['Fiduciary Core', 'Basic Indicators'],
    executionBudgetLimitMs: 500, // Strict cost budget
    topologyExecutionLimitDepth: 1, // Only single entity
    advisoryGenerationQuotaLimit: 5,
    allowedDeploymentLevels: [SAAS_LEVEL]
  },
  CORPORATE: {
    tierId: 'TIER-CORP',
    name: 'CORPORATE',
    basePrice: 8000,
    features: ['Fiduciary Core', 'Basic Indicators', 'Multi-Entity Light', 'Board Experience'],
    executionBudgetLimitMs: 2000,
    topologyExecutionLimitDepth: 3,
    advisoryGenerationQuotaLimit: 30,
    allowedDeploymentLevels: [SAAS_LEVEL, DEDICATED_TENANT_LEVEL]
  },
  ENTERPRISE: {
    tierId: 'TIER-ENT',
    name: 'ENTERPRISE',
    basePrice: 20000,
    features: ['Fiduciary Core', 'Basic Indicators', 'Consolidated Runtime', 'Systemic Heatmap', 'Institutional Memory', 'Guided Board Journeys'],
    executionBudgetLimitMs: 10000,
    topologyExecutionLimitDepth: 10,
    advisoryGenerationQuotaLimit: 200,
    allowedDeploymentLevels: [SAAS_LEVEL, DEDICATED_TENANT_LEVEL, DEDICATED_INFRA_LEVEL]
  },
  ADVISOR: {
    tierId: 'TIER-ADV',
    name: 'ADVISOR',
    basePrice: 35000,
    features: ['Fiduciary Core', 'Basic Indicators', 'Multi-tenant Supervision', 'Cross-client Governance', 'Advisor Operating Mode'],
    executionBudgetLimitMs: 15000,
    topologyExecutionLimitDepth: 15,
    advisoryGenerationQuotaLimit: 500,
    allowedDeploymentLevels: [SAAS_LEVEL, DEDICATED_TENANT_LEVEL, DEDICATED_INFRA_LEVEL]
  }
};

export class InstitutionalOfferingRegistry {
  public static getTier(tierName: string): CommercialTier | null {
    const tier = REGISTRY[tierName];
    if (!tier) return null;
    return Object.freeze(JSON.parse(JSON.stringify(tier)));
  }

  public static getAllTiers(): CommercialTier[] {
    return Object.keys(REGISTRY).map(key => this.getTier(key)!);
  }

  public static getTiers(): CommercialTier[] {
    return this.getAllTiers();
  }
}
