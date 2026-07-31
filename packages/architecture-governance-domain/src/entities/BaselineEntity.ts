import { BaselineContract, FindingContract } from '@illumine/architecture-governance-contracts';
import { BaselineId, CertificationId, SemanticVersion } from '@illumine/architecture-governance-types';

export class BaselineEntity implements BaselineContract {
  constructor(
    public readonly id: BaselineId,
    public readonly version: SemanticVersion,
    public readonly baselineType: 'Major' | 'Minor' | 'Hotfix' | 'Certification',
    public readonly issuedAt: Date,
    public readonly health: number,
    public readonly risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW',
    public readonly technicalDebt: number,
    public readonly findings: readonly FindingContract[],
    public readonly parentBaseline?: BaselineId,
    public readonly previousCertification?: CertificationId
  ) {}
}
