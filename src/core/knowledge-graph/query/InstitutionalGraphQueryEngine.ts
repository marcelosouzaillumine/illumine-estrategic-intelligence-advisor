import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";
import { InstitutionalNode } from "../../../types/knowledge-graph/InstitutionalNode";
import { InstitutionalRelationship } from "../../../types/knowledge-graph/InstitutionalRelationship";

export class InstitutionalGraphQueryEngine {
  static findNodeById(nodeId: string): InstitutionalNode | undefined {
    return InstitutionalGraphRegistry.getNode(nodeId);
  }

  static findRelationships(nodeId: string): InstitutionalRelationship[] {
    return InstitutionalGraphRegistry.getRelationships().filter(
      rel => rel.sourceNodeId === nodeId || rel.targetNodeId === nodeId
    );
  }

  static findCauses(targetNodeId: string): InstitutionalNode[] {
    const rels = InstitutionalGraphRegistry.getRelationships().filter(
      rel => rel.targetNodeId === targetNodeId && rel.relationshipType === "CAUSES"
    );
    return rels.map(r => InstitutionalGraphRegistry.getNode(r.sourceNodeId)).filter(n => n !== undefined) as InstitutionalNode[];
  }

  static findDependencies(nodeId: string): InstitutionalNode[] {
    const rels = InstitutionalGraphRegistry.getRelationships().filter(
      rel => rel.sourceNodeId === nodeId && rel.relationshipType === "DEPENDS_ON"
    );
    return rels.map(r => InstitutionalGraphRegistry.getNode(r.targetNodeId)).filter(n => n !== undefined) as InstitutionalNode[];
  }

  static findConnectedRisks(nodeId: string): InstitutionalNode[] {
    const rels = this.findRelationships(nodeId);
    return rels
      .map(r => InstitutionalGraphRegistry.getNode(r.sourceNodeId === nodeId ? r.targetNodeId : r.sourceNodeId))
      .filter(n => n?.nodeType === "RISK") as InstitutionalNode[];
  }

  static findConnectedDecisions(nodeId: string): InstitutionalNode[] {
    const rels = this.findRelationships(nodeId);
    return rels
      .map(r => InstitutionalGraphRegistry.getNode(r.sourceNodeId === nodeId ? r.targetNodeId : r.sourceNodeId))
      .filter(n => n?.nodeType === "DECISION") as InstitutionalNode[];
  }

  static findConnectedEvidence(nodeId: string): InstitutionalNode[] {
    const rels = this.findRelationships(nodeId);
    return rels
      .map(r => InstitutionalGraphRegistry.getNode(r.sourceNodeId === nodeId ? r.targetNodeId : r.sourceNodeId))
      .filter(n => n?.nodeType === "EVIDENCE") as InstitutionalNode[];
  }

  // --- Persistent Graph Query Extensions ---

  static async findNodeByIdPersistent(tenantId: string, nodeId: string) {
    const repo = InstitutionalGraphRegistry.getRepository();
    if (!repo) return null;
    return await repo.getNode(tenantId, nodeId);
  }

  static async findSnapshot(tenantId: string, snapshotId: string) {
    const repo = InstitutionalGraphRegistry.getRepository();
    if (!repo) return null;
    return await repo.loadSnapshot(tenantId, snapshotId);
  }

  static async findHistoricalPath(tenantId: string, targetNodeId: string) {
    const repo = InstitutionalGraphRegistry.getRepository();
    if (!repo) return [];
    const rels = await repo.getRelationships(tenantId, targetNodeId);
    const causes = rels.filter(r => r.targetNodeId === targetNodeId && r.relationshipType === "CAUSES");
    
    const nodes = [];
    for (const c of causes) {
      const node = await repo.getNode(tenantId, c.sourceNodeId);
      if (node) nodes.push(node);
    }
    return nodes;
  }

  static async findHistoricalDecision(tenantId: string, decisionId: string) {
    const repo = InstitutionalGraphRegistry.getRepository();
    if (!repo) return null;
    const node = await repo.getNode(tenantId, decisionId);
    if (node && node.nodeType === "DECISION") return node;
    return null;
  }
}
