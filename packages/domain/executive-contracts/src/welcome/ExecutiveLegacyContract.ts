export interface ExecutiveLegacyContract {
  readonly legacyId: string;
  readonly accumulatedRoiFormatted: string;
  readonly totalDecisionsImplementedCount: number;
  readonly totalProjectsCompletedCount: number;
  readonly valuePreservedFormatted: string;
  readonly valueCreatedFormatted: string;
  readonly keyMilestones: readonly string[];
  readonly recentAchievements: readonly string[];
  readonly historicalTimelineSummary: string;
  readonly isSimulatedBenchmark: boolean;
}
