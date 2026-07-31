export interface EvolutionEvidence {
  readonly id: string;
  readonly sourceSnapshotId: string;
  readonly targetSnapshotId: string;
  readonly artifactId: string;
  readonly detectedBy: 'AST_COMPARISON' | 'GRAPH_COMPARISON';
  readonly references: readonly string[];
}
