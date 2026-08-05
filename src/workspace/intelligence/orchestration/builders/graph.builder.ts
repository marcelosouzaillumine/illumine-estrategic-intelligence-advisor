import { EnterpriseGraph } from '../../core/graph/EnterpriseGraph';
import { GraphNode } from '../../core/graph/GraphNode';
import { GraphEdge } from '../../core/graph/GraphEdge';
import { EnterpriseNodeType, EnterpriseRelationshipType } from '../../core/graph/graph.types';

export class GraphBuilder {
  private graph: EnterpriseGraph;

  constructor() {
    this.graph = new EnterpriseGraph();
  }

  buildNode(id: string, label: string, type: EnterpriseNodeType, metadata: any = {}): GraphNode {
    const node = new GraphNode(id, label, type, metadata);
    this.graph.addNode(node);
    return node;
  }

  buildEdge(
    sourceId: string, 
    targetId: string, 
    relationship: EnterpriseRelationshipType, 
    confidence: number = 1.0, 
    weight: number = 1.0, 
    metadata: any = {}
  ): GraphEdge {
    const edge = new GraphEdge(sourceId, targetId, relationship, confidence, weight, metadata);
    this.graph.addEdge(edge);
    return edge;
  }

  getGraph(): EnterpriseGraph {
    return this.graph;
  }
}
