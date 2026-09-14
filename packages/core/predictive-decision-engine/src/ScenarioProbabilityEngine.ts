export class ScenarioProbabilityEngine {
  public static calculateScenarioProbability(baseConfidence: number, volatility: number): number {
    const raw = baseConfidence - volatility * 0.5;
    return Math.max(50, Math.min(99, Math.round(raw)));
  }
}
