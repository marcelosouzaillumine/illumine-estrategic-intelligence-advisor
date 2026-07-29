import { describe, it, expect } from 'vitest';
import { ExecutiveEvaluationFramework, EvaluationAxisScores } from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/executive-simulation-engine (Wave 15C Phase 3 Judgment Evaluation)', () => {
  it('should calculate weighted composite score across the 5 axes and validate passing score (>= 85)', () => {
    const scores: EvaluationAxisScores = {
      accuracyScore: Score.create(95),           // 95 * 0.25 = 23.75
      strategicAlignmentScore: Score.create(90), // 90 * 0.20 = 18.00
      economicImpactScore: Score.create(92),     // 92 * 0.25 = 23.00
      riskAwarenessScore: Score.create(94),      // 94 * 0.15 = 14.10
      executiveUsabilityScore: Score.create(96)  // 96 * 0.15 = 14.40
    };
    // Sum = 23.75 + 18.00 + 23.00 + 14.10 + 14.40 = 93.25 -> 93

    const result = ExecutiveEvaluationFramework.evaluateJudgment(scores);
    expect(result.compositeScore.value).toBe(93);
    expect(result.passed).toBe(true);
  });
});
