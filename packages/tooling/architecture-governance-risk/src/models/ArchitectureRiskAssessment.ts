import { RiskFactor } from './RiskFactor';

export type ExposureLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ArchitectureRiskAssessment {
  readonly id: string;
  readonly subject: string;
  readonly exposureLevel: ExposureLevel;
  readonly factors: readonly RiskFactor[];
  readonly evidence: readonly string[];
  readonly policyVersion: string;
  readonly generatedAt: string;
}
