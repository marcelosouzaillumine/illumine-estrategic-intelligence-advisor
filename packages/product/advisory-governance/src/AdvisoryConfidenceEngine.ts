import { Score } from '@illumine/core-primitives';

export type ConfidenceClassification =
  | 'HIGH CONFIDENCE'       // 90 - 100
  | 'SUPPORTED'             // 70 - 89
  | 'EXPLORATORY'           // 50 - 69
  | 'INSUFFICIENT EVIDENCE'; // < 50

export interface AdvisoryConfidenceAssessment {
  readonly score: Score;
  readonly classification: ConfidenceClassification;
}

export class AdvisoryConfidenceEngine {
  public static evaluateConfidence(
    dataConfidence: number,
    modelConfidence: number,
    historicalAccuracy: number
  ): AdvisoryConfidenceAssessment {
    const sum = dataConfidence * 0.4 + modelConfidence * 0.3 + historicalAccuracy * 0.3;
    const roundScore = Math.round(sum);
    const score = Score.create(roundScore);

    let classification: ConfidenceClassification = 'INSUFFICIENT EVIDENCE';
    if (roundScore >= 90) classification = 'HIGH CONFIDENCE';
    else if (roundScore >= 70) classification = 'SUPPORTED';
    else if (roundScore >= 50) classification = 'EXPLORATORY';

    return {
      score,
      classification
    };
  }
}
