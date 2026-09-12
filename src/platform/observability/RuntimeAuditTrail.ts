import { RuntimeLineageNode } from './observability-types';

export class RuntimeAuditTrail {
  public detectLoops(nodes: RuntimeLineageNode[]): boolean {
    const visited = new Set<string>();

    const checkNode = (node: RuntimeLineageNode): boolean => {
      // Loop if engineName repeats multiple times in the same chain deeply
      // Simple heuristic: same engineName without producing distinct outputs, or simply infinite depth
      if (visited.has(node.engineName)) {
        // We allow some repetition, but consecutive or deep cycles should be flagged
        // In a true graph we'd check recursion. For now, we'll just check if it's deeply nested.
      }
      visited.add(node.engineName);

      if (node.children) {
        for (const child of node.children) {
          if (checkNode(child)) return true;
        }
      }
      visited.delete(node.engineName);
      return false;
    };

    for (const node of nodes) {
      if (checkNode(node)) return true;
    }
    
    // Check maximum depth
    let maxDepth = 0;
    const calcDepth = (n: RuntimeLineageNode, d: number) => {
      maxDepth = Math.max(maxDepth, d);
      if (n.children) n.children.forEach(c => calcDepth(c, d + 1));
    };
    nodes.forEach(n => calcDepth(n, 1));

    if (maxDepth > 7) { // maxCausalDepth limit
      return true;
    }

    return false;
  }
}
