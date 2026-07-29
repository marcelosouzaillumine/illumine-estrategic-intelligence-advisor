import { Identifier } from '@illumine/core-primitives';
import { AgentRecommendation } from '@illumine/agent-runtime';

export interface HumanApprovalResult {
  readonly recommendationId: Identifier;
  readonly status: 'APPROVED' | 'REJECTED' | 'MODIFIED_AND_APPROVED' | 'PENDING_HUMAN_REVIEW';
  readonly approvedBy?: string;
  readonly approvedAt?: Date;
  readonly humanNotes?: string;
}

export class HumanApprovalGateway {
  public static evaluateApprovalRequirement(recommendation: AgentRecommendation): HumanApprovalResult {
    if (recommendation.riskLevel === 'HIGH') {
      return {
        recommendationId: recommendation.recommendationId,
        status: 'PENDING_HUMAN_REVIEW',
        humanNotes: 'Recomendação de risco elevado exige aprovação humana compulsória no gateway fiduciário (ADR-027).'
      };
    }

    return {
      recommendationId: recommendation.recommendationId,
      status: 'APPROVED',
      approvedBy: 'SYSTEM_AUTONOMY_LEVEL_2',
      approvedAt: new Date(),
      humanNotes: 'Recomendação aprovada automaticamente pelo nível 2 de autonomia.'
    };
  }
}
