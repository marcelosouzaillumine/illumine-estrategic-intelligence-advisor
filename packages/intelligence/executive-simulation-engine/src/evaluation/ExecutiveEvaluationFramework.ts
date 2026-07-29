import { Score } from '@illumine/core-primitives';

export interface EvaluationAxisScores {
  readonly accuracyScore: Score;           // 25%
  readonly strategicAlignmentScore: Score; // 20%
  readonly economicImpactScore: Score;     // 25%
  readonly riskAwarenessScore: Score;      // 15%
  readonly executiveUsabilityScore: Score; // 15%
}

export interface EvaluationResult {
  readonly compositeScore: Score;
  readonly passed: boolean;
  readonly axisScores: EvaluationAxisScores;
}

export class ExecutiveEvaluationFramework {
  public static evaluateJudgment(scores: EvaluationAxisScores): EvaluationResult {
    const sum =
      scores.accuracyScore.value * 0.25 +
      scores.strategicAlignmentScore.value * 0.20 +
      scores.economicImpactScore.value * 0.25 +
      scores.riskAwarenessScore.value * 0.15 +
      scores.executiveUsabilityScore.value * 0.15;

    const roundScore = Math.round(sum);
    const compositeScore = Score.create(roundScore);
    const passed = roundScore >= 85; // Nota de corte fixada na ADR-032

    return {
      compositeScore,
      passed,
      axisScores: scores
    };
  }
}
