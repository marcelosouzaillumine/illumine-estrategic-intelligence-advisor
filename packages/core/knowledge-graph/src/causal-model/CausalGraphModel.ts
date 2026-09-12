import { OntologicalGraphNode } from '../ontology/OntologicalGraphNode';
import { CausalRelationship } from '../relationships/CausalRelationship';

export class CausalGraphModel {
  private readonly nodes: Map<string, OntologicalGraphNode> = new Map();
  private readonly edges: CausalRelationship[] = [];

  public addNode(node: OntologicalGraphNode): void {
    this.nodes.set(node.id, node);
  }

  public addCausalEdge(edge: CausalRelationship): void {
    this.edges.push(edge);
  }

  public getNodes(): readonly OntologicalGraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getEdges(): readonly CausalRelationship[] {
    return this.edges;
  }

  public getDownstreamImpacts(sourceNodeId: string): CausalRelationship[] {
    return this.edges.filter(edge => edge.sourceNodeId === sourceNodeId);
  }
}
