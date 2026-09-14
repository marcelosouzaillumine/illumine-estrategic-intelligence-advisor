// src/core/runtime/audit-assurance/CausalChainEngine.ts
//
// Causal Chain Engine
// Traces and maps cause-and-effect paths across runtime domains (e.g. EBITDA covenants propagating to holding capex).

export interface CausalVector {
  sourceDomain: string;
  targetDomain: string;
  mechanism: string;
  triggerMetric: string;
  triggerValue: string | number;
  impactSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class CausalChainEngine {
  /**
   * Translates raw causal propagation steps into structured, human-readable assurance traces.
   */
  public traceCausalChain(vectors: CausalVector[]): string[] {
    return vectors.map(vector => {
      return `Causa: [${vector.sourceDomain}] disparou impacto em [${vector.targetDomain}] via '${vector.mechanism}' (métrica: ${vector.triggerMetric} = ${vector.triggerValue}) [Severidade: ${vector.impactSeverity}]`;
    });
  }

  /**
   * Scans a series of causal relationships to identify loops (cycles) which represent unsafe runtime paths.
   */
  public hasCyclicDependency(vectors: CausalVector[]): boolean {
    const adjList: Map<string, string[]> = new Map();
    
    for (const v of vectors) {
      if (!adjList.has(v.sourceDomain)) {
        adjList.set(v.sourceDomain, []);
      }
      adjList.get(v.sourceDomain)!.push(v.targetDomain);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (node: string): boolean => {
      if (recStack.has(node)) return true; // Cycle found
      if (visited.has(node)) return false;

      visited.add(node);
      recStack.add(node);

      const neighbors = adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) return true;
      }

      recStack.delete(node);
      return false;
    };

    for (const node of adjList.keys()) {
      if (dfs(node)) return true;
    }

    return false;
  }
}
