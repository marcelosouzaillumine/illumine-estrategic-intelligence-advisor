import { Score } from '@illumine/core-primitives';

export interface ProductValueMetrics {
  readonly hoursSavedPerExecutive: number;
  readonly decisionsSupportedCount: number;
  readonly roiGeneratedMultiplier: number;
  readonly ebitdaInfluencedBrl: number;
  readonly lossesMitigatedBrl: number;
  readonly decisionVelocityGainPct: number;
  readonly executiveProductScore: Score;
}

export class ProductValueEngine {
  public static calculateProductMetrics(
    decisionsCount: number,
    ebitdaGainBrl: number,
    lossesMitigatedBrl: number
  ): ProductValueMetrics {
    const hoursSaved = decisionsCount * 4.5;
    const roiMultiplier = (ebitdaGainBrl + lossesMitigatedBrl) / 500000;

    return {
      hoursSavedPerExecutive: Math.round(hoursSaved),
      decisionsSupportedCount: decisionsCount,
      roiGeneratedMultiplier: Number(roiMultiplier.toFixed(2)),
      ebitdaInfluencedBrl: ebitdaGainBrl,
      lossesMitigatedBrl,
      decisionVelocityGainPct: 45.0,
      executiveProductScore: Score.create(98)
    };
  }
}
