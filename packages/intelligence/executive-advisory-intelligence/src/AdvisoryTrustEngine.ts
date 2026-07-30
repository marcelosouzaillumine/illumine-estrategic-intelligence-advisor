import { ExecutiveRecommendationObject } from '@illumine/executive-contracts';

export class AdvisoryTrustEngine {
  public static calibrateRecommendationTrust(recommendation: ExecutiveRecommendationObject, historicalOutcomeDelta: number): number {
    const adjustment = historicalOutcomeDelta >= 0 ? 0.8 : -1.2;
    const calibratedScore = Math.min(100, Math.max(50, recommendation.advisoryTrustScore + adjustment));
    return parseFloat(calibratedScore.toFixed(1));
  }
}
