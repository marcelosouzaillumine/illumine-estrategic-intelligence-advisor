import { OrchestrationLineageReference, RecommendationEvidence } from './GovernanceOrchestrationTypes';

export class GovernanceRecommendationEvidenceBinder {
  static bindEvidence(
    tenantId: string,
    rationale: string,
    executionId: string,
    governanceContext: string,
    workflowIds?: string[],
    alertIds?: string[],
    simulationIds?: string[],
    benchmarkRefs?: string[],
    graphRefs?: string[]
  ): RecommendationEvidence {
    
    // Hash Fiduciário Mestre
    const raw = tenantId + '|' + executionId + '|' + governanceContext + '|' + Date.now();
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash = hash & hash;
    }
    const lineageHash = 'GOV-ORCH-LIN-' + Math.abs(hash).toString(16);

    const lineage: OrchestrationLineageReference = {
      executionId,
      workflowIds,
      alertIds,
      simulationIds,
      benchmarkRefs,
      graphRefs,
      governanceContext,
      lineageHash,
      timestamp: new Date().toISOString()
    };

    return {
      evidenceId: 'EVID-ORCH-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      tenantId,
      rationale,
      lineage
    };
  }
}
