import { ExecutiveRecommendationObject, DecisionCommandEnvelope, HumanReviewStatusType } from '@illumine/executive-contracts';

export class HumanExecutiveReviewEngine {
  public static reviewAndApproveRecommendation(
    recommendation: ExecutiveRecommendationObject,
    status: HumanReviewStatusType,
    reviewerId: string
  ): {
    readonly updatedRecommendation: ExecutiveRecommendationObject;
    readonly commandEnvelope?: DecisionCommandEnvelope;
  } {
    const updatedRecommendation: ExecutiveRecommendationObject = {
      ...recommendation,
      humanReviewStatus: status
    };

    if (status === 'APPROVED') {
      const commandEnvelope: DecisionCommandEnvelope = {
        decisionId: `dec-${recommendation.recommendationId}`,
        sourceAgent: 'ExecutiveAdvisorEngine',
        confidenceScore: recommendation.evidenceBundle.confidenceScore,
        impactedDomains: ['FINANCIAL'],
        expectedOutcome: recommendation.evidenceBundle.expectedImpact,
        riskLevel: 'HIGH',
        requiredApproval: 'EXECUTIVE',
        expirationDate: recommendation.expirationDate,
        createdAt: new Date().toISOString()
      };

      return { updatedRecommendation, commandEnvelope };
    }

    return { updatedRecommendation };
  }
}
