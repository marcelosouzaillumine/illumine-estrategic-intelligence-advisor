import { FindingContract, EvidenceContract } from '@illumine/architecture-governance-contracts';
import { Risk, CapabilityId } from '@illumine/architecture-governance-types';

export class FindingEntity implements FindingContract {
  constructor(
    public readonly id: string,
    public readonly evidences: readonly EvidenceContract[],
    public readonly impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    public readonly effort: 'HIGH' | 'MEDIUM' | 'LOW',
    public readonly priority: 'P0' | 'P1' | 'P2' | 'P3',
    public readonly risk: Risk,
    public readonly estimatedHours: number,
    public readonly affectedCapabilities: readonly CapabilityId[],
    public readonly blockedRelease: boolean
  ) {}
}
