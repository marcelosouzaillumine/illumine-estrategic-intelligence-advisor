import { PersistentGraphNode } from '../../../types/knowledge-graph/PersistentGraphNode';
import { PersistentGraphRelationship } from '../../../types/knowledge-graph/PersistentGraphRelationship';
import { PersistentGraphSnapshot } from '../../../types/knowledge-graph/PersistentGraphSnapshot';

export interface GraphRepository {
  saveNode(node: PersistentGraphNode): Promise<void>;
  saveRelationship(relationship: PersistentGraphRelationship): Promise<void>;
  getNode(tenantId: string, nodeId: string): Promise<PersistentGraphNode | undefined>;
  getRelationships(tenantId: string, nodeId: string): Promise<PersistentGraphRelationship[]>;
  getAllNodes(tenantId: string): Promise<PersistentGraphNode[]>;
  getAllRelationships(tenantId: string): Promise<PersistentGraphRelationship[]>;
  saveSnapshot(snapshot: PersistentGraphSnapshot): Promise<void>;
  loadSnapshot(tenantId: string, snapshotId: string): Promise<PersistentGraphSnapshot | undefined>;
}
