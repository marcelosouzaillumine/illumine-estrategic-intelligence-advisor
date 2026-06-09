import { PersistentGraphNode } from '../knowledge-graph/PersistentGraphNode';
import { PersistentGraphRelationship } from '../knowledge-graph/PersistentGraphRelationship';
import { PersistentGraphSnapshot } from '../knowledge-graph/PersistentGraphSnapshot';

export interface InvestigationResult {
  targetNode: PersistentGraphNode | null;
  evidences: PersistentGraphNode[];
  causes: PersistentGraphNode[];
  dependencies: PersistentGraphNode[];
  impacts: PersistentGraphNode[];
  relationships: PersistentGraphRelationship[];
  snapshot: PersistentGraphSnapshot | null;
  metrics: {
    totalEvidences: number;
    totalRelations: number;
    totalDrivers: number;
    totalConnectedRisks: number;
    totalConnectedDecisions: number;
  };
}
