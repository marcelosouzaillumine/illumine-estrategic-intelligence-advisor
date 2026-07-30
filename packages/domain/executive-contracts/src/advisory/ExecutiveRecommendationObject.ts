import { AdvisoryEvidenceContract } from './AdvisoryEvidenceContract';
import { StrategicScenarioContract } from './StrategicScenarioContract';

export type HumanReviewStatusType = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'MODIFIED';

export interface ExecutiveRecommendationObject {
  readonly recommendationId: string;
  readonly companyId: string;
  readonly title: string;
  readonly recommendationStatement: string;
  readonly strategicRationale: string;
  readonly evidenceBundle: AdvisoryEvidenceContract;
  readonly scenario: StrategicScenarioContract;
  readonly advisoryTrustScore: number;
  readonly humanReviewStatus: HumanReviewStatusType;
  readonly generatedAt: string;
  readonly expirationDate: string;
  readonly recommendationHash: string;
}
