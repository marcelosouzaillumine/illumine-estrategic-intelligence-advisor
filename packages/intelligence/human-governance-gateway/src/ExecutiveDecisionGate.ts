import { Identifier } from '@illumine/core-primitives';
import { AgentRecommendation } from '@illumine/agent-runtime';

export type GovernanceGateAction =
  | 'SURFACED_AUTOMATICALLY'
  | 'EXECUTIVE_ACKNOWLEDGMENT_REQUIRED'
  | 'MANDATORY_APPROVAL_REQUIRED'
  | 'BOARD_LEVEL_WORKFLOW_REQUIRED';

export interface DecisionGateEvaluation {
  readonly recommendationId: Identifier;
  readonly riskLevel: AgentRecommendation['riskLevel'];
  readonly isCritical: boolean;
  readonly gateAction: GovernanceGateAction;
  readonly notes: string;
}

export class ExecutiveDecisionGate {
  public static evaluateDecisionGate(
    recommendation: AgentRecommendation,
    isCriticalScenario: boolean = false
  ): DecisionGateEvaluation {
    if (isCriticalScenario) {
      return {
        recommendationId: recommendation.recommendationId,
        riskLevel: recommendation.riskLevel,
        isCritical: true,
        gateAction: 'BOARD_LEVEL_WORKFLOW_REQUIRED',
        notes: 'Cenário crítico exige fluxo governado do Conselho de Administração.'
      };
    }

    if (recommendation.riskLevel === 'HIGH') {
      return {
        recommendationId: recommendation.recommendationId,
        riskLevel: 'HIGH',
        isCritical: false,
        gateAction: 'MANDATORY_APPROVAL_REQUIRED',
        notes: 'Risco HIGH exige aprovação humana compulsória prévia antes da progressão.'
      };
    }

    if (recommendation.riskLevel === 'MEDIUM') {
      return {
        recommendationId: recommendation.recommendationId,
        riskLevel: 'MEDIUM',
        isCritical: false,
        gateAction: 'EXECUTIVE_ACKNOWLEDGMENT_REQUIRED',
        notes: 'Risco MEDIUM exige confirmação/ciência do executivo responsável.'
      };
    }

    return {
      recommendationId: recommendation.recommendationId,
      riskLevel: 'LOW',
      isCritical: false,
      gateAction: 'SURFACED_AUTOMATICALLY',
      notes: 'Risco LOW autoriza a exibição automática da recomendação.'
    };
  }
}
