export type StructuralChangeType = 
  | 'CREATED'
  | 'DELETED'
  | 'MODIFIED'
  | 'MOVED'
  | 'RECONNECTED';

export interface StructuralChange {
  readonly artifactId: string;
  readonly changeType: StructuralChangeType;
  readonly fromSnapshotId: string;
  readonly toSnapshotId: string;
}
