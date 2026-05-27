export type PlanTierName = 'BASIC' | 'CORPORATE' | 'ENTERPRISE' | 'ADVISOR';

export interface RuntimeCostClassification {
  cost: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  fiduciarySensitivity: 'STANDARD' | 'STRICT' | 'BOARD_CRITICAL';
}

export interface DeploymentGovernanceLevel {
  mode: 'SHARED_SAAS' | 'DEDICATED_TENANT' | 'DEDICATED_INFRA';
  isolation: 'LOGICAL' | 'STRONG_LOGICAL' | 'PHYSICAL_INFRA';
  governance: 'STANDARD' | 'ENHANCED' | 'SOVEREIGN';
}

export interface CommercialTier {
  tierId: string;
  name: PlanTierName;
  basePrice: number;
  features: string[];
  executionBudgetLimitMs: number;
  topologyExecutionLimitDepth: number;
  advisoryGenerationQuotaLimit: number;
  allowedDeploymentLevels: DeploymentGovernanceLevel[];
}

export interface EnterpriseFeature {
  featureId: string;
  name: string;
  module: string;
  active: boolean;
  classification: RuntimeCostClassification;
}
