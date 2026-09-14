import { EvidenceContract, RelationshipGraph } from '@illumine/architecture-governance-contracts';
import { EvidenceId, RuleId, CapabilityId, Severity, EvidenceSource } from '@illumine/architecture-governance-types';

export class EvidenceEntity implements EvidenceContract {
  constructor(
    public readonly id: EvidenceId,
    public readonly ruleId: RuleId,
    public readonly capabilityId: CapabilityId,
    public readonly severity: Severity,
    public readonly confidence: 'HIGH' | 'MEDIUM' | 'LOW',
    public readonly source: EvidenceSource,
    public readonly affectedFiles: readonly string[],
    public readonly recommendation: string,
    public readonly owner: string,
    public readonly relationships: RelationshipGraph
  ) {}
}
