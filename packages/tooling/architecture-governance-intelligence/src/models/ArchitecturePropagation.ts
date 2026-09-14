export interface ArchitecturePropagation {
  readonly target: string;
  readonly affectedArtifacts: string[];
  readonly impactDepth: number;
  readonly evidence: string[];
}
