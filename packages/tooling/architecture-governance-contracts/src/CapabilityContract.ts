import { CapabilityId, WaveId, SemanticVersion, Lifecycle, CertificationStatus, Risk, CapabilityType } from '@illumine/architecture-governance-types';
import { ArchitectureScore, CapabilityScore, RelationshipGraph } from './SharedContracts';

export interface CapabilityContract {
  id: CapabilityId;
  name: string;
  version: SemanticVersion;
  owner: string;
  domain: string;
  wave: WaveId;
  introducedWave: WaveId;
  lastModifiedWave: WaveId;
  maturity: number;
  lifecycle: Lifecycle;
  strategicImportance: CapabilityType;
  certificationStatus: CertificationStatus;
  
  scores: CapabilityScore;
  architectureScore: ArchitectureScore;
  
  dependencies: readonly CapabilityId[];
  relationships: RelationshipGraph;
  
  certificationHistory: readonly string[];
}
