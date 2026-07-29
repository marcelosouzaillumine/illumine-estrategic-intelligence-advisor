import { Identifier, Score } from '@illumine/core-primitives';

export interface AdvisoryValueResult {
  readonly caseId: Identifier;
  readonly roiScore: Score;
  readonly ebitdaImprovementRealized: number;
  readonly productivityGainPct: number;
}

export class AdvisoryValueRealizationEngine {
  public static calculateAdvisoryRoi(
    financialGain: number,
    operationalGain: number,
    strategicGain: number
  ): AdvisoryValueResult {
    const sum = financialGain * 0.4 + operationalGain * 0.3 + strategicGain * 0.3;
    const roundScore = Math.min(100, Math.max(0, Math.round(sum)));
    const roiScore = Score.create(roundScore);

    return {
      caseId: 'case-roi-01',
      roiScore,
      ebitdaImprovementRealized: financialGain * 10000,
      productivityGainPct: operationalGain * 0.1
    };
  }
}
