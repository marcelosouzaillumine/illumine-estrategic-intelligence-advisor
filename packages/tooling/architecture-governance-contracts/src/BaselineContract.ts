import { BaselineId, CertificationId, SemanticVersion } from '@illumine/architecture-governance-types';
import { FindingContract } from './FindingContract';

export interface BaselineContract {
  id: BaselineId;
  version: SemanticVersion;
  baselineType: 'Major' | 'Minor' | 'Hotfix' | 'Certification';
  parentBaseline?: BaselineId;
  previousCertification?: CertificationId;
  issuedAt: Date;
  health: number;
  risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  technicalDebt: number;
  findings: readonly FindingContract[];
}
