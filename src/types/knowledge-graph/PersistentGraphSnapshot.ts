import { PersistentGraphNode } from './PersistentGraphNode';
import { PersistentGraphRelationship } from './PersistentGraphRelationship';

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
