export type TemporalTransitionType = 
  | 'EVOLUTION' 
  | 'REGRESSION' 
  | 'STRUCTURAL_PIVOT' 
  | 'CONSTITUTIONAL_BREACH' 
  | 'STABILIZATION';

export interface TemporalLineage {
  lineageId: string;
  sourceSnapshotId: string;
  targetSnapshotId: string;
  transitionType: TemporalTransitionType;
  eventIds: string[];
  changedNodes: string[];
  changedRelationships: string[];
  createdAt: string;
}
