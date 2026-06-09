import { useState, useEffect } from 'react';
import { CognitiveQueryEngine } from '../core/knowledge-graph/query/CognitiveQueryEngine';
import { InstitutionalGraphRegistry } from '../core/knowledge-graph/InstitutionalGraphRegistry';
import { ExecutiveCognitiveViewModel } from '../viewmodels/cognitive/ExecutiveCognitiveViewModel';

export function useExecutiveCognitiveInsight(targetNodeId?: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [viewModel, setViewModel] = useState<ExecutiveCognitiveViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetNodeId) {
      setViewModel(null);
      setError('ID Alvo não fornecido. Caminho causal não pode ser inferido.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const targetNode = InstitutionalGraphRegistry.getNode(targetNodeId);

      if (!targetNode) {
        setViewModel(new ExecutiveCognitiveViewModel(null, null, null, null));
        setError('Nó alvo não localizado no Institutional Knowledge Graph.');
        setLoading(false);
        return;
      }

      // Query engine is deterministic and sync, but we simulate async for UI readiness
      setTimeout(() => {
        const queryEngine = new CognitiveQueryEngine();

        // Trace Evidence backward
        const evidenceResult = queryEngine.traceEvidence(targetNodeId);

        // Find root causes
        const rootCauseResult = queryEngine.findRootCauses(targetNodeId);

        // Find Decision dependencies
        const decisionResult = queryEngine.traceDecision(targetNodeId);

        // Impact Analysis
        const impactResult = queryEngine.findImpactPath(targetNodeId);

        const vm = new ExecutiveCognitiveViewModel(
          evidenceResult,
          impactResult,
          decisionResult,
          rootCauseResult,
          targetNode
        );

        setViewModel(vm);
        setLoading(false);
      }, 300);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha desconhecida no Rastreio Cognitivo.');
      setLoading(false);
    }
  }, [targetNodeId]);

  return {
    loading,
    viewModel,
    error
  };
}
