import { CertificationContract } from '@illumine/architecture-governance-contracts';
import { CertificationId, CertificationStatus, GateResult } from '@illumine/architecture-governance-types';

export class CertificationEntity implements CertificationContract {
  constructor(
    public readonly id: CertificationId,
    public readonly targetId: string,
    public readonly scope: 'Platform' | 'Capability' | 'Release' | 'AI' | 'Security' | 'Data',
    public readonly version: string,
    public readonly issuedAt: Date,
    public readonly expiresAt: Date,
    public readonly score: number,
    public readonly status: CertificationStatus,
    public readonly gateResult: GateResult,
    public readonly seal: string
  ) {}
}
