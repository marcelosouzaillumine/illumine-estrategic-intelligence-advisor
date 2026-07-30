export interface StrategicScenarioContract {
  readonly scenarioId: string;
  readonly title: string;
  readonly currentBaselineMetrics: Record<string, number>;
  readonly projectedMetrics: Record<string, number>;
  readonly projectedEbitdaDeltaPercent: number;
  readonly projectedRiskReductionPercent: number;
}
