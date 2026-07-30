export interface ExecutiveMomentContract {
  readonly momentId: string;
  readonly title: string;
  readonly milestoneDescription: string;
  readonly significanceText: string;
  readonly impactSummaryText: string;
  readonly keyLearningText: string;
  readonly recommendedNextObjectiveText: string;
  readonly achievedDateIso: string;
  readonly isSimulatedBenchmark: boolean;
}
