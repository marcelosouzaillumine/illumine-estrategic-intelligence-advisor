import { Identifier, Score } from '@illumine/core-primitives';
import { AgentEvidenceBundle, AgentRiskLevel } from '@illumine/agent-runtime';

export type DecisionCategory =
  | 'Financial'
  | 'Strategic'
  | 'Operational'
  | 'Governance'
  | 'Risk'
  | 'People'
  | 'Commercial'
  | 'Innovation';

export interface AdvisoryRecommendationContract {
  readonly recommendationId: Identifier;
  readonly originatingAgent: string;
  readonly decisionCategory: DecisionCategory;
  readonly businessContext: string;
  readonly evidenceBundle: AgentEvidenceBundle;
  readonly confidenceScore: Score;
  readonly riskClassification: AgentRiskLevel;
  readonly approvalRequirement: 'HUMAN_APPROVAL_COMPULSORY' | 'AUTONOMOUS_LEVEL_2';
  readonly executionStatus: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED' | 'REJECTED';
}
