import { ExecutiveNode } from './ExecutiveNode';

export class AdvisorNetwork {
  private readonly nodes: Map<string, ExecutiveNode> = new Map();

  public registerNode(node: ExecutiveNode): void {
    this.nodes.set(node.nodeId, node);
  }

  public getNode(id: string): ExecutiveNode | undefined {
    return this.nodes.get(id);
  }

  public getNodesByRole(role: ExecutiveNode['role']): ExecutiveNode[] {
    return Array.from(this.nodes.values()).filter(n => n.role === role);
  }
}
