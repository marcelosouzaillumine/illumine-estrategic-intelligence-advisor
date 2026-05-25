import { WarningEvidence, WarningLineageReference } from './EarlyWarningTypes';

export class WarningEvidenceBinder {
  static bindEvidence(
    tenantId: string,
    description: string,
    executionId: string,
    sourceAlertIds?: string[],
    workflowIds?: string[],
    scenarioIds?: string[],
    graphPatternIds?: string[]
  ): WarningEvidence {
    
    // Hash mock para lineage (fiduciário in-memory)
    const raw = tenantId + '|' + executionId + '|' + (sourceAlertIds?.join(',') || '') + '|' + (workflowIds?.join(',') || '') + '|' + Date.now();
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash = hash & hash;
    }
    const lineageHash = 'EW-LIN-' + Math.abs(hash).toString(16);

    const lineage: WarningLineageReference = {
      executionId,
      sourceAlertIds,
      workflowIds,
      scenarioIds,
      graphPatternIds,
      lineageHash
    };

    return {
      evidenceId: 'EVID-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      tenantId,
      description,
      timestamp: new Date().toISOString(),
      lineage
    };
  }
}
