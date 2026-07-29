import { Score } from '@illumine/core-primitives';

export type PriorityClassification = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ExecutivePriorityResult {
  readonly priorityScore: Score;
  readonly classification: PriorityClassification;
}

export class ExecutivePriorityEngine {
  public static calculatePriority(
    businessImpactScore: number,   // 40%
    urgencyScore: number,          // 25%
    confidenceScore: number,       // 20%
    strategicAlignmentScore: number // 15%
  ): ExecutivePriorityResult {
    const sum =
      businessImpactScore * 0.40 +
      urgencyScore * 0.25 +
      confidenceScore * 0.20 +
      strategicAlignmentScore * 0.15;

    const roundScore = Math.round(sum);
    const priorityScore = Score.create(roundScore);

    let classification: PriorityClassification = 'LOW';
    if (roundScore >= 90) classification = 'CRITICAL';
    else if (roundScore >= 75) classification = 'HIGH';
    else if (roundScore >= 50) classification = 'MEDIUM';

    return {
      priorityScore,
      classification
    };
  }
}
