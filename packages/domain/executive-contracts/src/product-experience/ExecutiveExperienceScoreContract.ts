export interface ExecutiveExperienceScoreContract {
  readonly scoreId: string;
  readonly companyId: string;
  readonly eesOverallScore: number; // 0 to 100
  readonly timeToUnderstandingSeconds: number;
  readonly timeToDecisionDays: number;
  readonly narrativeClarityScore: number;
  readonly recommendationUsageRatePercent: number;
  readonly executionRatePercent: number;
  readonly evaluatedAt: string;
}
