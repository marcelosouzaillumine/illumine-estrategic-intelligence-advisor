import { EnterpriseKnowledgeNode } from '../knowledge/EnterpriseKnowledgeNode';

export class EnterpriseKnowledgeRegistry {
  private readonly nodes: Map<string, EnterpriseKnowledgeNode> = new Map();

  public register(node: EnterpriseKnowledgeNode): void {
    this.nodes.set(node.nodeId, node);
  }

  public getById(id: string): EnterpriseKnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  public getAll(): readonly EnterpriseKnowledgeNode[] {
    return Array.from(this.nodes.values());
  }
}
