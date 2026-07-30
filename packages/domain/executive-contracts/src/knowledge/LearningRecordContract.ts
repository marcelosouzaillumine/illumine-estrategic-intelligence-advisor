export interface LearningRecordContract {
  readonly recordId: string;
  readonly decisionId: string;
  readonly companyId: string;
  readonly expectedImpact: number;
  readonly actualOutcome: number;
  readonly deltaPercent: number;
  readonly varianceReason: string;
  readonly calibrationFactor: number;
  readonly timestamp: string;
}
