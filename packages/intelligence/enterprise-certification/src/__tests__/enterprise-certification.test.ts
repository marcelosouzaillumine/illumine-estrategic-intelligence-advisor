import { describe, it, expect } from 'vitest';
import {
  EnterpriseIntelligenceScoreCalculator,
  EnterpriseMaturityLevel,
  EnISDimensions
} from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/enterprise-certification (Wave 14 Phase 6 EnIS)', () => {
  it('should calculate composite Enterprise Intelligence Score (EnIS) and classify Networked Enterprise level', () => {
    const dimensions: EnISDimensions = {
      knowledgeConnectivityScore: Score.create(85),
      crossDomainScore: Score.create(90),
      decisionIntegrationScore: Score.create(80),
      organizationalLearningScore: Score.create(85),
      governanceMaturityScore: Score.create(95)
    };

    // 85*0.2 + 90*0.2 + 80*0.2 + 85*0.2 + 95*0.2 = 17 + 18 + 16 + 17 + 19 = 87 -> Networked Enterprise
    const result = EnterpriseIntelligenceScoreCalculator.calculateEnIS(dimensions);
    expect(result.compositeScore.value).toBe(87);
    expect(result.maturityLevel).toBe(EnterpriseMaturityLevel.NETWORKED_ENTERPRISE);
  });
});
