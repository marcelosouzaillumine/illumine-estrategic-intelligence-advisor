import { useState, useEffect } from 'react';
import { EngineSemanticOutput, SemanticConcept } from '../../../../core/runtime/semantic-consistency/ExecutiveSemanticRegistry';
import { ExecutiveConsistencyReportEngine, ExecutiveConsistencyReport } from '../../../../core/runtime/semantic-consistency/ExecutiveConsistencyReportEngine';
import { ConsistencyTrendEngine, ConsistencyDataPoint, ConsistencyTrend } from '../../../../core/runtime/semantic-consistency/ConsistencyTrendEngine';
import { SemanticConsistencyStatus } from '../../../../core/runtime/semantic-consistency/CrossEngineSemanticConsistencyEngine';
import { NarrativeStatus } from '../../../../core/runtime/semantic-consistency/NarrativeConsistencyEngine';

export interface SemanticConsistencyHookResult extends ExecutiveConsistencyReport {
  trend: ConsistencyTrend;
  isLoading: boolean;
}

export function useSemanticConsistency(outputs: EngineSemanticOutput[] = []): SemanticConsistencyHookResult {
  const [data, setData] = useState<SemanticConsistencyHookResult>({
    score: 100,
    status: SemanticConsistencyStatus.ALTA_CONSISTENCIA,
    conflicts: [],
    narrativeStatus: NarrativeStatus.COMPATIBLE,
    causalNarrative: 'A organização apresenta consistência em todas as perspectivas avaliadas.',
    executiveSummary: 'Score Semântico: 100/100. Excelente nível de coerência informacional institucional.',
    trend: ConsistencyTrend.STABLE,
    isLoading: true
  });

  useEffect(() => {
    // If no real data, we can inject a dummy/mock profile to see it working on the UI
    const effectiveOutputs = outputs.length > 0 ? outputs : [
      { engineId: 'BP', concept: SemanticConcept.LIQUIDITY, rawClassification: 'STRONG', narrative: 'Forte capacidade.' },
      { engineId: 'DFC', concept: SemanticConcept.LIQUIDITY, rawClassification: 'WEAK', narrative: 'Limitação severa de caixa.' },
      { engineId: 'ESG', concept: SemanticConcept.GOVERNANCE_MATURITY, rawClassification: 'MODERATE' },
      { engineId: 'Governance', concept: SemanticConcept.GOVERNANCE_MATURITY, rawClassification: 'STRONG' }
    ];

    const report = ExecutiveConsistencyReportEngine.generateReport(effectiveOutputs);

    // Dummy history for trend calculation
    const history: ConsistencyDataPoint[] = [
      { month: 'Jan', score: 65 },
      { month: 'Fev', score: 70 },
      { month: 'Mar', score: report.score } // Current
    ];
    
    const trend = ConsistencyTrendEngine.evaluateTrend(history);

    setData({
      ...report,
      trend,
      isLoading: false
    });
  }, [outputs]);

  return data;
}
