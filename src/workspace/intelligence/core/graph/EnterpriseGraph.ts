import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';

export class EnterpriseGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();

  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  addEdge(edge: GraphEdge): void {
    if (!this.nodes.has(edge.sourceId)) {
      throw new Error(`Source node ${edge.sourceId} does not exist in the graph.`);
    }
    if (!this.nodes.has(edge.targetId)) {
      throw new Error(`Target node ${edge.targetId} does not exist in the graph.`);
    }
    this.edges.set(edge.id, edge);
  }

  getEdge(id: string): GraphEdge | undefined {
    return this.edges.get(id);
  }

  getEdgesFrom(nodeId: string): GraphEdge[] {
    return Array.from(this.edges.values()).filter(e => e.sourceId === nodeId);
  }

  getEdgesTo(nodeId: string): GraphEdge[] {
    return Array.from(this.edges.values()).filter(e => e.targetId === nodeId);
  }

  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }
}
