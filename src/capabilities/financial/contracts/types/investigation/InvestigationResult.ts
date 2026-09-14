import { PersistentGraphNode } from '../../../../../types/knowledge-graph/PersistentGraphNode';
import { PersistentGraphRelationship } from '../../../../../types/knowledge-graph/PersistentGraphRelationship';
import { PersistentGraphSnapshot } from '../../../../../types/knowledge-graph/PersistentGraphSnapshot';

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
