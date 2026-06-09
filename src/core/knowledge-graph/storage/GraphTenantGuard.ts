import { GraphRepository } from './GraphRepository';
import { PersistentGraphNode } from '../../../types/knowledge-graph/PersistentGraphNode';
import { PersistentGraphRelationship } from '../../../types/knowledge-graph/PersistentGraphRelationship';
import { PersistentGraphSnapshot } from '../../../types/knowledge-graph/PersistentGraphSnapshot';

export class GraphTenantGuard implements GraphRepository {
  constructor(
    private readonly delegate: GraphRepository,
    private readonly currentTenantId: string
  ) {}

  private validateTenant(tenantId: string) {
    if (tenantId !== this.currentTenantId) {
      throw new Error(`[GraphTenantGuard] TENANT_BOUNDARY_VIOLATION: Attempted to access tenant ${tenantId} from context of ${this.currentTenantId}`);
    }
  }

  async saveNode(node: PersistentGraphNode): Promise<void> {
    this.validateTenant(node.tenantId);
    return this.delegate.saveNode(node);
  }

  async saveRelationship(relationship: PersistentGraphRelationship): Promise<void> {
    this.validateTenant(relationship.tenantId);
    return this.delegate.saveRelationship(relationship);
  }

  async getNode(tenantId: string, nodeId: string): Promise<PersistentGraphNode | undefined> {
    this.validateTenant(tenantId);
    return this.delegate.getNode(tenantId, nodeId);
  }

  async getRelationships(tenantId: string, nodeId: string): Promise<PersistentGraphRelationship[]> {
    this.validateTenant(tenantId);
    return this.delegate.getRelationships(tenantId, nodeId);
  }

  async getAllNodes(tenantId: string): Promise<PersistentGraphNode[]> {
    this.validateTenant(tenantId);
    return this.delegate.getAllNodes(tenantId);
  }

  async getAllRelationships(tenantId: string): Promise<PersistentGraphRelationship[]> {
    this.validateTenant(tenantId);
    return this.delegate.getAllRelationships(tenantId);
  }

  async saveSnapshot(snapshot: PersistentGraphSnapshot): Promise<void> {
    this.validateTenant(snapshot.tenantId);
    return this.delegate.saveSnapshot(snapshot);
  }

  async loadSnapshot(tenantId: string, snapshotId: string): Promise<PersistentGraphSnapshot | undefined> {
    this.validateTenant(tenantId);
    return this.delegate.loadSnapshot(tenantId, snapshotId);
  }
}
