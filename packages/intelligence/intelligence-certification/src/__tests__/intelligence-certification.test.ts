import { describe, it, expect } from 'vitest';
import {
  ExecutiveIntelligenceScoreCalculator,
  IntelligenceMaturityLevel,
  IntelligenceTrajectory,
  EISDimensions
} from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/intelligence-certification (Phase 6 Certification & EIS)', () => {
  it('should calculate composite Executive Intelligence Score (EIS) and determine maturity level', () => {
    const dimensions: EISDimensions = {
      decisionQualityScore: Score.create(80),
      predictiveAccuracyScore: Score.create(75),
      explainabilityScore: Score.create(95),
      continuousLearningScore: Score.create(70),
      cognitiveGovernanceScore: Score.create(90)
    };

    // 80*0.2 + 75*0.2 + 95*0.2 + 70*0.2 + 90*0.2 = 16 + 15 + 19 + 14 + 18 = 82 -> ADAPTATIVA
    const result = ExecutiveIntelligenceScoreCalculator.calculateEIS(dimensions);
    expect(result.compositeScore.value).toBe(82);
    expect(result.maturityLevel).toBe(IntelligenceMaturityLevel.ADAPTATIVA);
  });

  it('should track historical trajectory via IntelligenceTrajectory', () => {
    const trajectory = new IntelligenceTrajectory();
    const dimensions: EISDimensions = {
      decisionQualityScore: Score.create(60),
      predictiveAccuracyScore: Score.create(60),
      explainabilityScore: Score.create(60),
      continuousLearningScore: Score.create(60),
      cognitiveGovernanceScore: Score.create(60)
    };

    // Score = 60 -> CONSULTIVA (41-60)
    const res = ExecutiveIntelligenceScoreCalculator.calculateEIS(dimensions);
    trajectory.addPoint({
      period: '2026-Q1',
      result: res,
      recordedAt: '2026-03-31T00:00:00Z'
    });

    expect(trajectory.getHistory().length).toBe(1);
    expect(trajectory.getLatestScore()?.maturityLevel).toBe(IntelligenceMaturityLevel.CONSULTIVA);
  });
});
