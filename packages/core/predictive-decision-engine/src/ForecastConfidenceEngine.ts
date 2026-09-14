export class ForecastConfidenceEngine {
  public static calculateConfidence(dataPointsCount: number, dataFreshnessDays: number): number {
    const dataPointsBonus = Math.min(dataPointsCount * 2, 20);
    const freshnessPenalty = Math.min(dataFreshnessDays * 0.5, 10);
    return Math.min(99, Math.max(70, Math.round(85 + dataPointsBonus - freshnessPenalty)));
  }
}
