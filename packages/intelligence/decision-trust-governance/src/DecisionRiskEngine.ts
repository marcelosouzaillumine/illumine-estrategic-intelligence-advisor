export class DecisionRiskEngine {
  public static calculateCompositeRiskScore(riskScores: {
    readonly financialRiskScore: number;
    readonly operationalRiskScore: number;
    readonly strategicRiskScore: number;
    readonly executionRiskScore: number;
    readonly dataRiskScore: number;
    readonly forecastRiskScore: number;
  }): number {
    const values = Object.values(riskScores);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Number(avg.toFixed(1));
  }
}
