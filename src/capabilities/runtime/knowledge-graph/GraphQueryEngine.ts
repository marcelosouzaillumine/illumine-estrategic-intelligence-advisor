import { GraphQuery, GraphQueryResult, GraphExecutionRecord } from './KnowledgeGraphTypes';
import { InstitutionalKnowledgeGraph } from './InstitutionalKnowledgeGraph';
import { KnowledgeGraphGovernanceEngine } from './KnowledgeGraphGovernanceEngine';
import { GraphAuditLogger } from './GraphAuditLogger';

export class GraphQueryEngine {
  static executeQuery(query: GraphQuery): GraphQueryResult | null {
    const start = performance.now();

    if (!KnowledgeGraphGovernanceEngine.validateQueryScope(query)) {
      return null;
    }

    const allNodes = InstitutionalKnowledgeGraph.getNodesByTenant(query.tenantId);
    const allEdges = InstitutionalKnowledgeGraph.getEdgesByTenant(query.tenantId);

    // Filter Nodes
    let filteredNodes = allNodes;
    if (query.nodeTypes && query.nodeTypes.length > 0) {
      filteredNodes = filteredNodes.filter(n => query.nodeTypes!.includes(n.type));
    }

    // Filter Edges (onde ambos source e target existem no subgrafo, se a query for estrita)
    let filteredEdges = allEdges;
    if (query.edgeTypes && query.edgeTypes.length > 0) {
      filteredEdges = filteredEdges.filter(e => query.edgeTypes!.includes(e.type));
    }

    // Mantemos as arestas conectadas a pelo menos um nó filtrado se houver filtros de nós
    if (query.nodeTypes && query.nodeTypes.length > 0) {
      const validNodeIds = new Set(filteredNodes.map(n => n.nodeId));
      filteredEdges = filteredEdges.filter(e => validNodeIds.has(e.sourceNodeId) || validNodeIds.has(e.targetNodeId));
      
      // Expande os nós para incluir as pontas das arestas válidas (graph traversal 1 nível)
      const missingNodeIds = new Set<string>();
      filteredEdges.forEach(e => {
        if (!validNodeIds.has(e.sourceNodeId)) missingNodeIds.add(e.sourceNodeId);
        if (!validNodeIds.has(e.targetNodeId)) missingNodeIds.add(e.targetNodeId);
      });
      missingNodeIds.forEach(id => {
        const node = InstitutionalKnowledgeGraph.getNode(id);
        if (node && node.tenantId === query.tenantId) {
          filteredNodes.push(node);
        }
      });
    }

    const result: GraphQueryResult = {
      nodes: filteredNodes,
      edges: filteredEdges
    };

    const executionTimeMs = performance.now() - start;

    GraphAuditLogger.logEvent(
      query.tenantId,
      'GRAPH_QUERY_EXECUTED',
      `Intent: "\${query.intent}" | Nodes: \${result.nodes.length} | Edges: \${result.edges.length}`
    );

    return result;
  }
}
