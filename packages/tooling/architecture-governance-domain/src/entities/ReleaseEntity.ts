import { ReleaseContract } from '@illumine/architecture-governance-contracts';
import { ReleaseId, CertificationId } from '@illumine/architecture-governance-types';

export class ReleaseEntity implements ReleaseContract {
  constructor(
    public readonly id: ReleaseId,
    public readonly version: string,
    public readonly releaseType: 'Major' | 'Minor' | 'Patch' | 'Hotfix',
    public readonly build: string,
    public readonly certificationId: CertificationId,
    public readonly approvedBy: readonly string[],
    public readonly deployedAt: Date
  ) {}
}
