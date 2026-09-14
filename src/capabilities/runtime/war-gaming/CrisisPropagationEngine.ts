// src/core/runtime/war-gaming/CrisisPropagationEngine.ts

import { CrisisPropagationNode } from './war-gaming-types';

export class CrisisPropagationEngine {
  /**
   * Translates CrisisPropagationNode into causal textual explanations mapping
   * the cross-statement propagation during a crisis.
   */
  public static mapCrossStatementCausality(nodes: CrisisPropagationNode[]): string[] {
    const causalChains: string[] = [];

    nodes.forEach(node => {
      if (node.causalLinkTo) {
        const nextNode = nodes.find(n => n.nodeId === node.causalLinkTo);
        if (nextNode) {
          causalChains.push(
            `Pressão originada em [${node.variable}] propagou estresse em [${nextNode.variable}] (${node.rationale}).`
          );
        }
      }
    });

    return causalChains;
  }
}
