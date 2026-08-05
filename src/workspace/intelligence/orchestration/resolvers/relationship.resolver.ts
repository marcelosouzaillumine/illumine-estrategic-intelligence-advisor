import { EnterpriseGraph } from '../../core/graph/EnterpriseGraph';
import { GraphTraversal } from '../../core/graph/GraphTraversal';
import { EnterpriseRelationshipType } from '../../core/graph/graph.types';

export class RelationshipResolver {
  private traversal: GraphTraversal;

  constructor(private graph: EnterpriseGraph) {
    this.traversal = new GraphTraversal(graph);
  }

  /**
   * Find if two nodes are causally related within a certain depth
   */
  findCausalLink(sourceId: string, targetId: string, maxDepth: number = 3): boolean {
    const connections = this.traversal.findConnectedNodes(sourceId, maxDepth);
    return connections.some(c => c.node.id === targetId && c.path.some(p => p.relationship === 'CAUSES' || p.relationship === 'INFLUENCES'));
  }

  /**
   * Calculates a combined confidence score for a path
   */
  calculatePathConfidence(pathIdList: string[]): number {
    let combined = 1.0;
    for (const edgeId of pathIdList) {
      const edge = this.graph.getEdge(edgeId);
      if (edge) {
        combined *= edge.confidence;
      }
    }
    return combined;
  }
}
