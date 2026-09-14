import { AdvisorProfileContract } from '@illumine/executive-contracts';

export class AdvisorPerformanceEngine {
  public static calculatePerformanceScore(profile: AdvisorProfileContract): number {
    const raw = (profile.fiduciaryScore * 0.4) + (profile.implementationRatePercent * 0.3) + (profile.successRatePercent * 0.3);
    return Number(raw.toFixed(1));
  }
}
