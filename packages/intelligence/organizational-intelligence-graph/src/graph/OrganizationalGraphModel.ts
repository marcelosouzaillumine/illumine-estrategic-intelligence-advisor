import { OrgGraphNode } from '../nodes/OrganizationNode';
import { OrgImpactRelationship } from '../relationships/ImpactRelationship';

export class OrganizationalGraphModel {
  private readonly nodes: Map<string, OrgGraphNode> = new Map();
  private readonly edges: OrgImpactRelationship[] = [];

  public addNode(node: OrgGraphNode): void {
    this.nodes.set(node.id, node);
  }

  public addEdge(edge: OrgImpactRelationship): void {
    this.edges.push(edge);
  }

  public getNodes(): readonly OrgGraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getEdges(): readonly OrgImpactRelationship[] {
    return this.edges;
  }

  public traceChainFromStrategy(strategyId: string): OrgImpactRelationship[] {
    return this.edges.filter(e => e.sourceId === strategyId);
  }
}
