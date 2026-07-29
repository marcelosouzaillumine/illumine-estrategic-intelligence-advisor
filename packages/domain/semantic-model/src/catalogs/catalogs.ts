import { SemanticEntity } from '../kernel/semantic-kernel';

export interface KPICatalogItem extends SemanticEntity {
  readonly metricCode: string;
  readonly unit: 'PERCENTAGE' | 'CURRENCY' | 'RATIO' | 'COUNT' | 'SCORE';
  readonly targetDirection: 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'STABLE_IS_BETTER';
  readonly formulaDescription: string;
}

export interface RiskCatalogItem extends SemanticEntity {
  readonly riskCode: string;
  readonly severityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  readonly mitigationStrategySummary: string;
}

export interface PolicyCatalogItem extends SemanticEntity {
  readonly policyCode: string;
  readonly enforcementLevel: 'MANDATORY' | 'RECOMMENDED' | 'ADVISORY';
  readonly approvalAuthorityRole: string;
}
