export interface RevenueForecastMetrics {
  annualTargetBrl: number;
  totalPipelineBrl: number;
  weightedPipelineBrl: number;
  forecastAccuracyPercentage: number;
  projectedArrBrl: number;
  targetCoveragePercentage: number;
}

export class RevenueForecastEngine {
  public static getForecast(): RevenueForecastMetrics {
    return {
      annualTargetBrl: 5000000,
      totalPipelineBrl: 18000000,
      weightedPipelineBrl: 6200000,
      forecastAccuracyPercentage: 88.5,
      projectedArrBrl: 5600000,
      targetCoveragePercentage: 112
    };
  }
}
