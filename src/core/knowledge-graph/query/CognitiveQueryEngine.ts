import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";
import { InstitutionalNode } from "../../../types/knowledge-graph/InstitutionalNode";
import { InstitutionalRelationship } from "../../../types/knowledge-graph/InstitutionalRelationship";
import { CognitiveQuery, CognitiveQueryResult } from "../../../types/knowledge-graph/CognitiveQuery";
import { CognitivePath } from "../../../types/knowledge-graph/CognitivePath";

export class CognitiveQueryEngine {
  
  /**
   * findRootCauses(nodeId)
   * Percorrer relações: CAUSES, INFLUENCES, GENERATED_BY, DERIVED_FROM
   * em direção reversa (target = nodeId).
   */
  public findRootCauses(nodeId: string): CognitiveQueryResult {
    const validEdges = ['CAUSES', 'INFLUENCES', 'GENERATED_BY', 'DERIVED_FROM'];
    return this.executeTraversalQuery('ROOT_CAUSE', nodeId, validEdges, 'REVERSE');
  }

  /**
   * findImpactPath(nodeId)
   * Percorrer relações: INFLUENCES, AGGRAVATES, SUPPORTS, BLOCKS
   * em direção direta (source = nodeId).
   */
  public findImpactPath(nodeId: string): CognitiveQueryResult {
    const validEdges = ['INFLUENCES', 'AGGRAVATES', 'SUPPORTS', 'BLOCKS'];
    return this.executeTraversalQuery('IMPACT_ANALYSIS', nodeId, validEdges, 'FORWARD');
  }

  /**
   * traceEvidence(nodeId)
   * Encontrar todas as evidências conectadas por: SUPPORTS, DERIVED_FROM
   */
  public traceEvidence(nodeId: string): CognitiveQueryResult {
    const validEdges = ['SUPPORTS', 'DERIVED_FROM'];
    // Evidence traces typically look backward to see what supports the node
    return this.executeTraversalQuery('EVIDENCE_TRACE', nodeId, validEdges, 'REVERSE');
  }

  /**
   * traceDecision(nodeId)
   * Encontrar decisões conectadas por: INFLUENCES, SUPPORTS, BLOCKS, GENERATED_BY
   */
  public traceDecision(nodeId: string): CognitiveQueryResult {
    const validEdges = ['INFLUENCES', 'SUPPORTS', 'BLOCKS', 'GENERATED_BY'];
    // Trace decision usually means finding decisions impacted by this node (Forward)
    return this.executeTraversalQuery('DECISION_TRACE', nodeId, validEdges, 'FORWARD');
  }

  /**
   * findRiskCluster(nodeId)
   * Encontrar riscos conectados por: CAUSES, AGGRAVATES, INFLUENCES
   */
  public findRiskCluster(nodeId: string): CognitiveQueryResult {
    const validEdges = ['CAUSES', 'AGGRAVATES', 'INFLUENCES'];
    // Risk clusters can be bidirectional
    return this.executeTraversalQuery('RISK_CLUSTER', nodeId, validEdges, 'BIDIRECTIONAL');
  }

  /**
   * findCausalPath(sourceNodeId, targetNodeId)
   * Buscar caminho determinístico entre dois nós usando BFS.
   */
  public findCausalPath(sourceNodeId: string, targetNodeId: string): CognitiveQueryResult {
    const allRelationships = InstitutionalGraphRegistry.getRelationships();
    const adjList = new Map<string, InstitutionalRelationship[]>();
    
    // Build adjacency
    allRelationships.forEach(rel => {
      if (!adjList.has(rel.sourceNodeId)) adjList.set(rel.sourceNodeId, []);
      adjList.get(rel.sourceNodeId)!.push(rel);
    });

    const queue: { nodeId: string; pathRels: InstitutionalRelationship[] }[] = [];
    queue.push({ nodeId: sourceNodeId, pathRels: [] });
    
    const visited = new Set<string>();
    visited.add(sourceNodeId);

    let foundPath: InstitutionalRelationship[] | null = null;

    while (queue.length > 0) {
      const { nodeId, pathRels } = queue.shift()!;
      if (nodeId === targetNodeId) {
        foundPath = pathRels;
        break;
      }
      const neighbors = adjList.get(nodeId) || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.targetNodeId)) {
          visited.add(edge.targetNodeId);
          queue.push({
            nodeId: edge.targetNodeId,
            pathRels: [...pathRels, edge]
          });
        }
      }
    }

    const paths: CognitivePath[] = [];
    const nodesInPath = new Set<string>();
    const relsInPath: InstitutionalRelationship[] = [];

    if (foundPath) {
      nodesInPath.add(sourceNodeId);
      foundPath.forEach(rel => {
        nodesInPath.add(rel.targetNodeId);
        relsInPath.push(rel);
      });

      paths.push({
        pathId: `PATH-${sourceNodeId}-${targetNodeId}`,
        sourceNodeId,
        targetNodeId,
        nodes: Array.from(nodesInPath).map(id => InstitutionalGraphRegistry.getNode(id)!).filter(Boolean),
        relationships: relsInPath,
        pathLength: relsInPath.length,
        confidenceLevel: 'DETERMINISTIC'
      });
    }

    return {
      queryId: `Q-PATH-${Date.now()}`,
      resultType: 'CAUSAL_PATH',
      nodes: Array.from(nodesInPath).map(id => InstitutionalGraphRegistry.getNode(id)!).filter(Boolean),
      relationships: relsInPath,
      paths,
      confidenceLevel: 'DETERMINISTIC',
      generatedAt: new Date().toISOString()
    };
  }

  private executeTraversalQuery(
    type: CognitiveQuery['queryType'], 
    startNodeId: string, 
    allowedEdges: string[], 
    direction: 'FORWARD' | 'REVERSE' | 'BIDIRECTIONAL'
  ): CognitiveQueryResult {
    const visitedNodes = new Set<string>([startNodeId]);
    const visitedRels = new Set<InstitutionalRelationship>();
    const allRelationships = InstitutionalGraphRegistry.getRelationships();

    let added = true;
    while (added) {
      added = false;
      for (const rel of allRelationships) {
        if (visitedRels.has(rel)) continue;
        if (!allowedEdges.includes(rel.relationshipType)) continue;

        const matchesForward = direction !== 'REVERSE' && visitedNodes.has(rel.sourceNodeId);
        const matchesReverse = direction !== 'FORWARD' && visitedNodes.has(rel.targetNodeId);

        if (matchesForward || matchesReverse) {
          visitedNodes.add(rel.sourceNodeId);
          visitedNodes.add(rel.targetNodeId);
          visitedRels.add(rel);
          added = true;
        }
      }
    }

    const nodes = Array.from(visitedNodes)
      .map(id => InstitutionalGraphRegistry.getNode(id)!)
      .filter(Boolean);

    return {
      queryId: `Q-${type}-${Date.now()}`,
      resultType: type,
      nodes,
      relationships: Array.from(visitedRels),
      paths: [], // Explicit path mapping can be done if needed
      confidenceLevel: 'DETERMINISTIC',
      generatedAt: new Date().toISOString()
    };
  }
}
