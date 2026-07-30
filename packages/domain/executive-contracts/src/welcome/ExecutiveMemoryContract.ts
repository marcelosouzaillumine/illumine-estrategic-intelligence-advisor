export interface ExecutiveMemoryContract {
  readonly memoryId: string;
  readonly previousDecisionSummary: string;
  readonly daysAgo: number;
  readonly completedMilestonesCount: number;
  readonly totalMilestonesCount: number;
  readonly promptFollowUpText: string;
}
