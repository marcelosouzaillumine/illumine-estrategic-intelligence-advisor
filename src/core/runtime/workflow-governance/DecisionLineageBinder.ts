import { DecisionLineageReference } from './WorkflowGovernanceTypes';

export class DecisionLineageBinder {
  /**
   * Vincula uma decisão governada ao exato momento e output fiduciário (Lineage).
   */
  static bind(
    tenantId: string,
    workspaceId: string,
    sourceContext: { groupId?: string, executionId?: string, reportVersion?: string, scenarioId?: string, alertId?: string }
  ): DecisionLineageReference {
    return {
      tenantId,
      workspaceId,
      ...sourceContext,
      decisionHash: `HASH-DECISION-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
  }
}
