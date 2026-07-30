/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveRecommendationEngine } from '../index';

describe('Quality Gate 2 — Recommendation Evidence Gate Test', () => {
  it('should enforce that any recommendation includes evidence sources, confidence, expected impact and counterArguments', () => {
    const rec = ExecutiveRecommendationEngine.generateRecommendation('empresa-ev-check', 'Evidências', 'Texto');

    expect(rec.evidenceBundle.evidenceSources.length).toBeGreaterThan(0);
    expect(rec.evidenceBundle.confidenceScore).toBe(97.5);
    expect(rec.evidenceBundle.expectedImpact).toBeDefined();
    expect(rec.evidenceBundle.counterArguments.length).toBeGreaterThan(0);
  });
});
