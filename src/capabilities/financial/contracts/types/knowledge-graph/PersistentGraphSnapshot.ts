import { PersistentGraphNode } from '../../../../../types/knowledge-graph/PersistentGraphNode';
import { PersistentGraphRelationship } from '../../../../../types/knowledge-graph/PersistentGraphRelationship';

export interface PersistentGraphSnapshot {
  snapshotId: string;
  tenantId: string;
  correlationContext: string;
  lineageId: string;
  timestamp: string;
  nodes: PersistentGraphNode[];
  relationships: PersistentGraphRelationship[];
  generationEngine: string;
}
