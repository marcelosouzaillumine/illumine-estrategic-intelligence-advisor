import { KnowledgeNode, KnowledgeEdge, KnowledgeNodeType, KnowledgeEdgeType, SemanticLineageReference } from './KnowledgeGraphTypes';
import { KnowledgeGraphGovernanceEngine } from './KnowledgeGraphGovernanceEngine';
import { GraphAuditLogger } from './GraphAuditLogger';

export class InstitutionalKnowledgeGraph {
  // In-Memory Registry for MVP
  private static nodes: Map<string, KnowledgeNode> = new Map();
  private static edges: Map<string, KnowledgeEdge> = new Map();

  static addNode(tenantId: string, type: KnowledgeNodeType, label: string, attributes: Record<string, unknown> = {}): KnowledgeNode | null {
    if (!KnowledgeGraphGovernanceEngine.validateNodeCreation(tenantId)) return null;

    const nodeId = `NODE-\${Date.now()}-\${Math.floor(Math.random() * 1000)}`;
    const node: KnowledgeNode = {
      nodeId,
      tenantId,
      type,
      label,
      attributes,
      createdAt: new Date().toISOString()
    };

    this.nodes.set(nodeId, node);
    GraphAuditLogger.logEvent(tenantId, 'GRAPH_NODE_CREATED', `Nó criado: [\${type}] \${label}`);
    return node;
  }

  static addEdge(
    tenantId: string, 
    sourceNodeId: string, 
    targetNodeId: string, 
    type: KnowledgeEdgeType, 
    semanticLineage: SemanticLineageReference,
    weight?: number
  ): KnowledgeEdge | null {
    if (!KnowledgeGraphGovernanceEngine.validateEdgeCreation(tenantId, semanticLineage.lineageHash)) return null;
    
    if (!this.nodes.has(sourceNodeId) || !this.nodes.has(targetNodeId)) {
       throw new Error('Source ou Target node inexistente no grafo.');
    }

    const source = this.nodes.get(sourceNodeId)!;
    const target = this.nodes.get(targetNodeId)!;

    if (source.tenantId !== tenantId || target.tenantId !== tenantId) {
      GraphAuditLogger.logEvent(tenantId, 'GRAPH_QUERY_BLOCKED', 'Tentativa de criar aresta cross-tenant.');
      return null;
    }

    const edgeId = `EDGE-\${Date.now()}-\${Math.floor(Math.random() * 1000)}`;
    const edge: KnowledgeEdge = {
      edgeId,
      tenantId,
      sourceNodeId,
      targetNodeId,
      type,
      semanticLineage,
      weight,
      createdAt: new Date().toISOString()
    };

    this.edges.set(edgeId, edge);
    GraphAuditLogger.logEvent(tenantId, 'GRAPH_EDGE_CREATED', `Aresta criada: \${sourceNodeId} --[\${type}]--> \${targetNodeId}`);
    return edge;
  }

  static getNodesByTenant(tenantId: string): KnowledgeNode[] {
    return Array.from(this.nodes.values()).filter(n => n.tenantId === tenantId);
  }

  static getEdgesByTenant(tenantId: string): KnowledgeEdge[] {
    return Array.from(this.edges.values()).filter(e => e.tenantId === tenantId);
  }

  static getNode(nodeId: string): KnowledgeNode | undefined {
    return this.nodes.get(nodeId);
  }

  static clearTenant(tenantId: string): void {
    const nodesToRemove = this.getNodesByTenant(tenantId).map(n => n.nodeId);
    const edgesToRemove = this.getEdgesByTenant(tenantId).map(e => e.edgeId);
    
    nodesToRemove.forEach(id => this.nodes.delete(id));
    edgesToRemove.forEach(id => this.edges.delete(id));
  }
}
