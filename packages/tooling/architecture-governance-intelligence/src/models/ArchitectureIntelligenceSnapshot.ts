import { ArchitectureInsight } from './ArchitectureInsight';
import { ArchitecturePropagation } from './ArchitecturePropagation';

export interface IntelligenceSourceReferences {
  readonly discoverySnapshotId: string;
  readonly evaluationSnapshotId: string;
  readonly certificationSnapshotId: string;
}

export interface IntelligenceGeneratedBy {
  readonly engineVersion: string;
}

export interface ArchitectureIntelligenceSnapshot {
  readonly version: string;
  readonly source: IntelligenceSourceReferences;
  readonly insights: ArchitectureInsight[];
  readonly impacts: ArchitecturePropagation[];
  readonly generatedBy: IntelligenceGeneratedBy;
}
