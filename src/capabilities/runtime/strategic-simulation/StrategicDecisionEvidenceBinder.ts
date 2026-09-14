import { DecisionEvidence, DecisionLineageReference } from './StrategicSimulationTypes';

export class StrategicDecisionEvidenceBinder {
  static bindEvidence(
    tenantId: string,
    description: string,
    executionId: string,
    workflowIds?: string[],
    alertIds?: string[],
    scenarioIds?: string[],
    benchmarkRefs?: string[],
    graphPatternRefs?: string[],
    decisionIds?: string[]
  ): DecisionEvidence {
    
    // Lineage Fiduciário In-Memory Hash
    const raw = tenantId + '|' + executionId + '|' + (workflowIds?.join(',') || '') + '|' + Date.now();
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash = hash & hash;
    }
    const lineageHash = 'STRAT-LIN-' + Math.abs(hash).toString(16);

    const lineage: DecisionLineageReference = {
      executionId,
      workflowIds,
      alertIds,
      scenarioIds,
      benchmarkRefs,
      graphPatternRefs,
      decisionIds,
      lineageHash,
      timestamp: new Date().toISOString()
    };

    return {
      evidenceId: 'EVID-STRAT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      tenantId,
      description,
      lineage
    };
  }
}
