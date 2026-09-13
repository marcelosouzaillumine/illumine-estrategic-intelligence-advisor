import { BPNode } from '../../../lib/bpEngine';

export class StructuralRootNormalizer {
  /**
   * Corrige nós raiz patrimoniais zerados quando existirem filhos com valores válidos.
   * Não sobrescreve valores raiz válidos.
   */
  public static normalizeRootNodes(nodes: BPNode[]): void {
    const rootNodes = nodes.filter(n => !n.parentId);

    rootNodes.forEach(root => {
      if (
        root.value === null ||
        root.value === undefined ||
        Number.isNaN(root.value) ||
        (root.value === 0 && this.hasChildrenWithValue(root, nodes))
      ) {
        root.value = this.sumChildren(root, nodes);
      }
    });
  }

  private static hasChildrenWithValue(node: BPNode, allNodes: BPNode[]): boolean {
    const directChildren = allNodes.filter(n => n.parentId === node.id);
    for (const child of directChildren) {
      if (child.value && child.value !== 0) return true;
      if (this.hasChildrenWithValue(child, allNodes)) return true;
    }
    return false;
  }

  private static sumChildren(node: BPNode, allNodes: BPNode[]): number {
    const directChildren = allNodes.filter(n => n.parentId === node.id);
    if (directChildren.length === 0) return node.value || 0;

    let sum = 0;
    for (const child of directChildren) {
      if (child.isSynthetic && (child.value === 0 || child.value === undefined || child.value === null)) {
         sum += this.sumChildren(child, allNodes);
      } else {
         sum += child.value || 0;
      }
    }
    return sum;
  }
}
