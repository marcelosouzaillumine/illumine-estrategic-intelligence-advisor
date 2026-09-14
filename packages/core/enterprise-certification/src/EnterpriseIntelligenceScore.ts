import { Score } from '@illumine/core-primitives';
import { EnterpriseMaturityLevel, EnterpriseMaturityEvaluator } from './EnterpriseMaturityLevel';

export interface EnISDimensions {
  readonly knowledgeConnectivityScore: Score; // 20%
  readonly crossDomainScore: Score;           // 20%
  readonly decisionIntegrationScore: Score;    // 20%
  readonly organizationalLearningScore: Score; // 20%
  readonly governanceMaturityScore: Score;     // 20%
}

export interface EnterpriseIntelligenceScoreResult {
  readonly compositeScore: Score;
  readonly maturityLevel: EnterpriseMaturityLevel;
  readonly dimensions: EnISDimensions;
}

export class EnterpriseIntelligenceScoreCalculator {
  public static calculateEnIS(dimensions: EnISDimensions): EnterpriseIntelligenceScoreResult {
    const sum =
      dimensions.knowledgeConnectivityScore.value * 0.2 +
      dimensions.crossDomainScore.value * 0.2 +
      dimensions.decisionIntegrationScore.value * 0.2 +
      dimensions.organizationalLearningScore.value * 0.2 +
      dimensions.governanceMaturityScore.value * 0.2;

    const roundScore = Math.round(sum);
    const compositeScore = Score.create(roundScore);
    const maturityLevel = EnterpriseMaturityEvaluator.getLevelForScore(roundScore);

    return {
      compositeScore,
      maturityLevel,
      dimensions
    };
  }
}
