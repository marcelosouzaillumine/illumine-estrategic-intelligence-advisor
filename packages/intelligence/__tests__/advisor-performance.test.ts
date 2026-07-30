/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { AdvisorRegistryEngine, AdvisorPerformanceEngine } from '../partner-ecosystem/src';

describe('@illumine/intelligence (Wave 18.11 Advisor Performance Engine)', () => {
  it('should calculate composite advisor performance score based on success rate and fiduciary score', () => {
    const profile = AdvisorRegistryEngine.registerAdvisor('Mariana Costa', 'COMMERCIAL');
    const score = AdvisorPerformanceEngine.calculatePerformanceScore(profile);
    expect(score).toBeGreaterThan(90);
  });
});
