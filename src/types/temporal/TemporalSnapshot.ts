export type SnapshotType = 'BASELINE' | 'INCREMENTAL' | 'MILESTONE_TRIGGERED' | 'END_OF_CYCLE';

export interface TemporalSnapshot {
  snapshotId: string;
  tenantId: string;
  correlationId: string;
  lineageId: string;
  createdAt: string;
  nodeCount: number;
  relationshipCount: number;
  snapshotType: SnapshotType;
}
