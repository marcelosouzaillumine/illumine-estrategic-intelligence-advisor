// src/core/runtime/observability/PropagationChainTracer.ts
import { CausalityPropagationLink, CausalityStatementNode } from '../../core/runtime/CrossStatementCausalityEngine';

export interface PropagationChain {
  id: string;
  nodes: CausalityStatementNode[];
  edges: CausalityPropagationLink[];
  chainSeverity: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA';
  systemicImpact: string;
}

export function tracePropagationChains(tensions: CausalityPropagationLink[]): PropagationChain[] {
  if (!tensions || tensions.length === 0) return [];

  const chains: PropagationChain[] = [];
  const visited = new Set<CausalityPropagationLink>();

  // Helper to determine the severity of a chain
  const getChainSeverity = (edges: CausalityPropagationLink[]) => {
    if (edges.some(e => e.severity === 'CRÍTICA')) return 'CRÍTICA';
    if (edges.some(e => e.severity === 'ALTA')) return 'ALTA';
    if (edges.some(e => e.severity === 'MODERADA')) return 'MODERADA';
    return 'BAIXA';
  };

  // Helper to trace from a given starting edge
  const traceFrom = (startEdge: CausalityPropagationLink, currentEdges: CausalityPropagationLink[], currentNodes: CausalityStatementNode[]) => {
    visited.add(startEdge);
    let hasNext = false;

    // Find the next edges where target of current == source of next
    for (const nextEdge of tensions) {
      if (!visited.has(nextEdge) && nextEdge.source === startEdge.target) {
        hasNext = true;
        traceFrom(nextEdge, [...currentEdges, nextEdge], [...currentNodes, nextEdge.target]);
      }
    }

    // If this path ends here and it has more than 1 edge, we consider it a systemic chain
    if (!hasNext) {
      // Even a single edge is a chain in the new EFOS observability, so we push all terminal paths
      const severity = getChainSeverity(currentEdges);
      let systemicImpact = `Propagação terminal em ${currentNodes[currentNodes.length - 1]}`;
      
      if (currentEdges.length > 1) {
         systemicImpact = `Efeito dominó identificado impactando múltiplas dimensões: ${currentNodes.join(' → ')}`;
      } else {
         systemicImpact = `Tensão isolada detectada em ${currentNodes[0]} propagando para ${currentNodes[1]}`;
      }

      chains.push({
        id: `CHAIN_${currentNodes.join('_')}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`,
        nodes: currentNodes,
        edges: currentEdges,
        chainSeverity: severity,
        systemicImpact
      });
    }
  };

  // Start tracing from all root edges (edges where their source is not a target of any other edge)
  // Or just trace from any unvisited edge to catch isolated subgraphs
  for (const edge of tensions) {
    const isTarget = tensions.some(e => e.target === edge.source);
    if (!isTarget && !visited.has(edge)) {
      traceFrom(edge, [edge], [edge.source, edge.target]);
    }
  }

  // Fallback for circular dependencies or isolated edges that weren't caught as roots
  for (const edge of tensions) {
    if (!visited.has(edge)) {
      traceFrom(edge, [edge], [edge.source, edge.target]);
    }
  }

  return chains;
}
