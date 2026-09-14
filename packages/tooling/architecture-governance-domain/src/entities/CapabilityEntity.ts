import { CapabilityContract, CapabilityScore, ArchitectureScore, RelationshipGraph } from '@illumine/architecture-governance-contracts';
import { CapabilityId, WaveId, SemanticVersion, Lifecycle, CertificationStatus, CapabilityType } from '@illumine/architecture-governance-types';

export class CapabilityEntity implements CapabilityContract {
  constructor(
    public readonly id: CapabilityId,
    public readonly name: string,
    public readonly version: SemanticVersion,
    public readonly owner: string,
    public readonly domain: string,
    public readonly wave: WaveId,
    public readonly introducedWave: WaveId,
    public readonly lastModifiedWave: WaveId,
    public readonly maturity: number,
    public readonly lifecycle: Lifecycle,
    public readonly strategicImportance: CapabilityType,
    public readonly certificationStatus: CertificationStatus,
    public readonly scores: CapabilityScore,
    public readonly architectureScore: ArchitectureScore,
    public readonly dependencies: readonly CapabilityId[],
    public readonly relationships: RelationshipGraph,
    public readonly certificationHistory: readonly string[]
  ) {}
}
