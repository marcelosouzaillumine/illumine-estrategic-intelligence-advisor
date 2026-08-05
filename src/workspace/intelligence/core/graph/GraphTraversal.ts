import { EnterpriseGraph } from './EnterpriseGraph';
import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';

export class GraphTraversal {
  constructor(private graph: EnterpriseGraph) {}

  /**
   * Traverse the graph from a starting node to find all connected nodes up to a certain depth.
   */
  findConnectedNodes(startNodeId: string, maxDepth: number = 3): { node: GraphNode; depth: number; path: GraphEdge[] }[] {
    const startNode = this.graph.getNode(startNodeId);
    if (!startNode) return [];

    const visited = new Set<string>();
    const result: { node: GraphNode; depth: number; path: GraphEdge[] }[] = [];
    const queue: { currentId: string; depth: number; path: GraphEdge[] }[] = [];

    queue.push({ currentId: startNodeId, depth: 0, path: [] });
    visited.add(startNodeId);

    while (queue.length > 0) {
      const { currentId, depth, path } = queue.shift()!;
      const node = this.graph.getNode(currentId);
      
      if (node && depth > 0) {
        result.push({ node, depth, path });
      }

      if (depth < maxDepth) {
        const edges = this.graph.getEdgesFrom(currentId);
        for (const edge of edges) {
          if (!visited.has(edge.targetId)) {
            visited.add(edge.targetId);
            queue.push({
              currentId: edge.targetId,
              depth: depth + 1,
              path: [...path, edge]
            });
          }
        }
      }
    }

    return result;
  }
}
