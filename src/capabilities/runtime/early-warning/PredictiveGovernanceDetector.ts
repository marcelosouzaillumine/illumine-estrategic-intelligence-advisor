import { RiskSignal } from './EarlyWarningTypes';

export class PredictiveGovernanceDetector {
  static detectGovernanceDeterioration(tenantId: string): RiskSignal[] {
    // MOCK: Falha recorrente em workflows críticos
    return [
      {
        source: 'WORKFLOW_GOVERNANCE',
        value: 0.85,
        metadata: {
          insight: 'Alta taxa de escalada em Workflows de Liberação de Capital.',
          workflowIds: ['WF-CAP-001', 'WF-CAP-002']
        }
      }
    ];
  }
}
