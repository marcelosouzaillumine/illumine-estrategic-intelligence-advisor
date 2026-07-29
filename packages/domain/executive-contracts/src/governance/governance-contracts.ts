import { Score, Confidence } from '@illumine/core-primitives';

export interface BoardVote {
  readonly agentId: string;
  readonly vote: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_DATA' | 'ABSTAIN';
  readonly weight: number;
  readonly justification: string;
}

export interface DecisionIntegrityIndex {
  readonly confidenceScore: Confidence;
  readonly evidenceCoverageScore: Score;
  readonly explainabilityScore: Score;
  readonly freshnessScore: Score;
  readonly policyComplianceScore: Score;
  readonly humanApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  readonly predictionAccuracyScore: Score;
  readonly learningCoverageScore: Score;
  readonly compositeIntegrityScore: Score; // 0 a 100
}

export interface WeightMatrix {
  readonly domainTopic: string;
  readonly agentWeights: Record<string, number>;
}
