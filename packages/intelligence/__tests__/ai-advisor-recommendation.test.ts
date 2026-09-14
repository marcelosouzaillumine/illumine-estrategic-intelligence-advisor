/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { AdvisorAIRecommendationEngine } from '../platform-distribution/src';

describe('@illumine/governance (Wave 19.2 AI Advisor Recommendation Engine)', () => {
  it('should generate predictive AI recommendation with match confidence and reasoning', () => {
    const rec = AdvisorAIRecommendationEngine.recommendAdvisor('comp-granatum', 'adv-01');
    expect(rec.matchConfidencePercent).toBeGreaterThan(95);
    expect(rec.reasoningJustification).toContain('Tecnologia');
  });
});
