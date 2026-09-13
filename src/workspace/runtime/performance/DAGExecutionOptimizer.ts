import { EntityGraphData } from '../../../topology/types';
import { TenantViolations, TenantIsolationError } from '../../../core/runtime/tenancy/hardening/TenantExecutionContext';

export class DAGExecutionOptimizer {
  
  /**
   * Identifica ciclos em um grafo de execução e elimina execuções redundantes.
   * Não altera a Truth Layer nem o Lineage.
   */
  static optimizeTopology(topology: EntityGraphData): { optimizedNodes: string[], cycleWarnings: string[] } {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const optimizedNodes: string[] = [];
    const cycleWarnings: string[] = [];

    // Adjacency list para DFS
    const adjList = new Map<string, string[]>();
    topology.nodes.forEach(n => adjList.set(n.id, []));
    topology.edges.forEach(e => {
      if (adjList.has(e.sourceId)) {
        adjList.get(e.sourceId)!.push(e.targetId);
      }
    });

    const dfs = (nodeId: string, depth: number) => {
      if (depth > 50) {
        throw new TenantIsolationError(
          TenantViolations.RECURSIVE_RUNTIME_LOOP,
          `Recursão extrema ou loop infinito detectado na topologia a partir do nó ${nodeId}.`
        );
      }

      if (recStack.has(nodeId)) {
        cycleWarnings.push(`[CYCLE_DETECTED] Dependência circular encontrada no nó ${nodeId}. Quebrando ciclo de orquestração para evitar Recursion Overflow.`);
        return;
      }

      if (visited.has(nodeId)) return; // Dead-path elimination (redundancy prevention)

      visited.add(nodeId);
      recStack.add(nodeId);
      optimizedNodes.push(nodeId);

      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        dfs(neighbor, depth + 1);
      }

      recStack.delete(nodeId);
    };

    // Iniciar por nós raízes (indegree = 0), ou percorrer todos
    const inDegree = new Map<string, number>();
    topology.nodes.forEach(n => inDegree.set(n.id, 0));
    topology.edges.forEach(e => {
      if (inDegree.has(e.targetId)) {
        inDegree.set(e.targetId, inDegree.get(e.targetId)! + 1);
      }
    });

    // Start with root nodes
    for (const [nodeId, degree] of inDegree.entries()) {
      if (degree === 0 && !visited.has(nodeId)) {
        dfs(nodeId, 0);
      }
    }

    // Capture disconnected graphs
    for (const nodeId of adjList.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId, 0);
      }
    }

    return { optimizedNodes, cycleWarnings };
  }
}
