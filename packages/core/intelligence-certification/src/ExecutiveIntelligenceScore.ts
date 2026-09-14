import { Score } from '@illumine/core-primitives';
import { IntelligenceMaturityLevel, MaturityEvaluator } from './IntelligenceMaturityLevel';

export interface EISDimensions {
  readonly decisionQualityScore: Score;    // 20%
  readonly predictiveAccuracyScore: Score; // 20%
  readonly explainabilityScore: Score;      // 20%
  readonly continuousLearningScore: Score;  // 20%
  readonly cognitiveGovernanceScore: Score; // 20%
}

export interface ExecutiveIntelligenceScoreResult {
  readonly compositeScore: Score;
  readonly maturityLevel: IntelligenceMaturityLevel;
  readonly dimensions: EISDimensions;
}

export class ExecutiveIntelligenceScoreCalculator {
  public static calculateEIS(dimensions: EISDimensions): ExecutiveIntelligenceScoreResult {
    const sum =
      dimensions.decisionQualityScore.value * 0.2 +
      dimensions.predictiveAccuracyScore.value * 0.2 +
      dimensions.explainabilityScore.value * 0.2 +
      dimensions.continuousLearningScore.value * 0.2 +
      dimensions.cognitiveGovernanceScore.value * 0.2;

    const roundScore = Math.round(sum);
    const compositeScore = Score.create(roundScore);
    const maturityLevel = MaturityEvaluator.getLevelForScore(roundScore);

    return {
      compositeScore,
      maturityLevel,
      dimensions
    };
  }
}
