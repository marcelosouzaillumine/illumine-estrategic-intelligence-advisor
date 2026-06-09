import { InstitutionalGraphQueryEngine } from '../knowledge-graph/query/InstitutionalGraphQueryEngine';
import { InstitutionalGraphRegistry } from '../knowledge-graph/InstitutionalGraphRegistry';
import { InvestigationContext } from '../../types/investigation/InvestigationContext';
import { InvestigationSession } from '../../types/investigation/InvestigationSession';
import { InvestigationResult } from '../../types/investigation/InvestigationResult';
import { PersistentGraphNode } from '../../types/knowledge-graph/PersistentGraphNode';
import { PersistentGraphRelationship } from '../../types/knowledge-graph/PersistentGraphRelationship';

export class BoardInvestigationRuntime {
  static async startInvestigation(
    context: InvestigationContext,
    targetNodeId: string
  ): Promise<{ session: InvestigationSession; result: InvestigationResult }> {
    const session: InvestigationSession = {
      investigationId: crypto.randomUUID(),
      tenantId: context.tenantId,
      userId: context.userId,
      startedAt: new Date().toISOString(),
      targetNodeId,
      targetNodeType: 'UNKNOWN',
      correlationId: context.correlationId,
      lineageId: context.lineageId
    };

    const targetNode = await this.loadNode(context.tenantId, targetNodeId, context.snapshotId);
    if (targetNode) {
      session.targetNodeType = targetNode.nodeType;
    }

    const result = await this.gatherInvestigationResult(context, targetNode);

    return { session, result };
  }

  static async loadNode(tenantId: string, nodeId: string, snapshotId?: string): Promise<PersistentGraphNode | null> {
    if (snapshotId) {
      const snapshot = await InstitutionalGraphQueryEngine.findSnapshot(tenantId, snapshotId);
      return snapshot?.nodes.find(n => n.nodeId === nodeId) || null;
    }
    return await InstitutionalGraphQueryEngine.findNodeByIdPersistent(tenantId, nodeId);
  }

  static async loadEvidence(tenantId: string, nodeId: string, snapshotId?: string): Promise<PersistentGraphNode[]> {
    if (snapshotId) {
      const snapshot = await InstitutionalGraphQueryEngine.findSnapshot(tenantId, snapshotId);
      if (!snapshot) return [];
      const rels = snapshot.relationships.filter(r => r.sourceNodeId === nodeId || r.targetNodeId === nodeId);
      return rels
        .map(r => snapshot.nodes.find(n => n.nodeId === (r.sourceNodeId === nodeId ? r.targetNodeId : r.sourceNodeId)))
        .filter(n => n?.nodeType === 'EVIDENCE') as PersistentGraphNode[];
    }
    
    const repo = InstitutionalGraphRegistry.getRepository();
    if (!repo) return [];
    
    const rels = await repo.getRelationships(tenantId, nodeId);
    const evidences: PersistentGraphNode[] = [];
    for (const r of rels) {
      const otherId = r.sourceNodeId === nodeId ? r.targetNodeId : r.sourceNodeId;
      const node = await repo.getNode(tenantId, otherId);
      if (node && node.nodeType === 'EVIDENCE') evidences.push(node);
    }
    return evidences;
  }

  static async loadExplainability(tenantId: string, nodeId: string, snapshotId?: string): Promise<{ causes: PersistentGraphNode[], dependencies: PersistentGraphNode[], impacts: PersistentGraphNode[] }> {
    const causes: PersistentGraphNode[] = [];
    const dependencies: PersistentGraphNode[] = [];
    const impacts: PersistentGraphNode[] = [];

    const repo = InstitutionalGraphRegistry.getRepository();
    if (!repo && !snapshotId) return { causes, dependencies, impacts };

    let rels: PersistentGraphRelationship[] = [];
    if (snapshotId) {
      const snapshot = await InstitutionalGraphQueryEngine.findSnapshot(tenantId, snapshotId);
      if (snapshot) rels = snapshot.relationships.filter(r => r.sourceNodeId === nodeId || r.targetNodeId === nodeId);
    } else if (repo) {
      rels = await repo.getRelationships(tenantId, nodeId);
    }

    for (const r of rels) {
      const otherId = r.sourceNodeId === nodeId ? r.targetNodeId : r.sourceNodeId;
      let node: PersistentGraphNode | null | undefined;
      
      if (snapshotId) {
        const snapshot = await InstitutionalGraphQueryEngine.findSnapshot(tenantId, snapshotId);
        node = snapshot?.nodes.find(n => n.nodeId === otherId);
      } else if (repo) {
        node = await repo.getNode(tenantId, otherId);
      }

      if (node) {
        if (r.targetNodeId === nodeId && r.relationshipType === 'CAUSES') causes.push(node);
        else if (r.sourceNodeId === nodeId && r.relationshipType === 'DEPENDS_ON') dependencies.push(node);
        else if (r.sourceNodeId === nodeId && r.relationshipType === 'CAUSES') impacts.push(node);
      }
    }

    return { causes, dependencies, impacts };
  }

  static async loadRelationships(tenantId: string, nodeId: string, snapshotId?: string): Promise<PersistentGraphRelationship[]> {
    if (snapshotId) {
      const snapshot = await InstitutionalGraphQueryEngine.findSnapshot(tenantId, snapshotId);
      return snapshot?.relationships.filter(r => r.sourceNodeId === nodeId || r.targetNodeId === nodeId) || [];
    }
    const repo = InstitutionalGraphRegistry.getRepository();
    if (!repo) return [];
    return await repo.getRelationships(tenantId, nodeId);
  }

  static async loadTimeline(tenantId: string, nodeId: string): Promise<PersistentGraphNode[]> {
    const historicalPath = await InstitutionalGraphQueryEngine.findHistoricalPath(tenantId, nodeId);
    return historicalPath as PersistentGraphNode[];
  }

  private static async gatherInvestigationResult(context: InvestigationContext, targetNode: PersistentGraphNode | null): Promise<InvestigationResult> {
    if (!targetNode) {
      return {
        targetNode: null, evidences: [], causes: [], dependencies: [], impacts: [],
        relationships: [], snapshot: null,
        metrics: { totalEvidences: 0, totalRelations: 0, totalDrivers: 0, totalConnectedRisks: 0, totalConnectedDecisions: 0 }
      };
    }

    const [evidences, expl, relationships, snapshot] = await Promise.all([
      this.loadEvidence(context.tenantId, targetNode.nodeId, context.snapshotId),
      this.loadExplainability(context.tenantId, targetNode.nodeId, context.snapshotId),
      this.loadRelationships(context.tenantId, targetNode.nodeId, context.snapshotId),
      context.snapshotId ? InstitutionalGraphQueryEngine.findSnapshot(context.tenantId, context.snapshotId) : Promise.resolve(null)
    ]);

    let totalConnectedRisks = 0;
    let totalConnectedDecisions = 0;

    for (const r of relationships) {
      const otherId = r.sourceNodeId === targetNode.nodeId ? r.targetNodeId : r.sourceNodeId;
      const node = await this.loadNode(context.tenantId, otherId, context.snapshotId);
      if (node?.nodeType === 'RISK') totalConnectedRisks++;
      if (node?.nodeType === 'DECISION') totalConnectedDecisions++;
    }

    return {
      targetNode,
      evidences,
      causes: expl.causes,
      dependencies: expl.dependencies,
      impacts: expl.impacts,
      relationships,
      snapshot: snapshot || null,
      metrics: {
        totalEvidences: evidences.length,
        totalRelations: relationships.length,
        totalDrivers: expl.causes.length + expl.dependencies.length + expl.impacts.length,
        totalConnectedRisks,
        totalConnectedDecisions
      }
    };
  }
}
