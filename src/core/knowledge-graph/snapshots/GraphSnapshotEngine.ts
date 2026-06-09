import { InstitutionalGraphRegistry } from '../InstitutionalGraphRegistry';
import { PersistentGraphSnapshot } from '../../../types/knowledge-graph/PersistentGraphSnapshot';
import { PersistentGraphNode } from '../../../types/knowledge-graph/PersistentGraphNode';
import { PersistentGraphRelationship } from '../../../types/knowledge-graph/PersistentGraphRelationship';

export class GraphSnapshotEngine {
  static async createSnapshot(
    snapshotId: string, 
    tenantId: string, 
    correlationContext: string,
    lineageId: string
  ): Promise<PersistentGraphSnapshot | null> {
    
    const repo = InstitutionalGraphRegistry.getRepository();
    if (!repo) {
      console.warn('[GraphSnapshotEngine] Cannot create snapshot without an active repository.');
      return null;
    }

    const currentNodes = InstitutionalGraphRegistry.getAllNodes();
    const currentRelationships = InstitutionalGraphRegistry.getRelationships();

    const timestamp = new Date().toISOString();

    const persistentNodes: PersistentGraphNode[] = currentNodes.map(n => ({
      ...n,
      tenantId,
      correlationId: correlationContext,
      lineageId,
      sourceEngine: 'GraphSnapshotEngine',
      createdAt: timestamp,
      updatedAt: timestamp
    }));

    const persistentRelationships: PersistentGraphRelationship[] = currentRelationships.map(r => ({
      ...r,
      tenantId,
      correlationId: correlationContext,
      lineageId,
      sourceEngine: 'GraphSnapshotEngine',
      createdAt: timestamp,
      updatedAt: timestamp
    }));

    const snapshot: PersistentGraphSnapshot = {
      snapshotId,
      tenantId,
      correlationContext,
      lineageId,
      timestamp,
      nodes: persistentNodes,
      relationships: persistentRelationships,
      generationEngine: 'GraphSnapshotEngine'
    };

    await repo.saveSnapshot(snapshot);
    return snapshot;
  }
}
