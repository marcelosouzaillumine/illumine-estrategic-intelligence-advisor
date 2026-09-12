export interface ExecutiveHomeSummary {
  readonly topDecisionsCount: number; // Max 3
  readonly emergingRisksCount: number; // Max 5
  readonly opportunitiesCount: number; // Max 3
  readonly trackedActionsCount: number; // Max 7
  readonly recentLearningsCount: number; // Max 2
}

export class ExecutiveHomeExperience {
  public static getHomeSummary(): ExecutiveHomeSummary {
    return {
      topDecisionsCount: 3,
      emergingRisksCount: 5,
      opportunitiesCount: 3,
      trackedActionsCount: 7,
      recentLearningsCount: 2
    };
  }
}
