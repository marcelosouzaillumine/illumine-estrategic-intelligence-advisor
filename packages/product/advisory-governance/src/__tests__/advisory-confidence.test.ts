import { describe, it, expect } from 'vitest';
import { AdvisoryConfidenceEngine } from '../index';

describe('@illumine/advisory-governance (Wave 15D Phase 3 Confidence Model)', () => {
  it('should classify HIGH CONFIDENCE for scores >= 90', () => {
    const res = AdvisoryConfidenceEngine.evaluateConfidence(95, 90, 92);
    expect(res.score.value).toBe(93);
    expect(res.classification).toBe('HIGH CONFIDENCE');
  });

  it('should classify INSUFFICIENT EVIDENCE for scores < 50', () => {
    const res = AdvisoryConfidenceEngine.evaluateConfidence(40, 30, 45);
    expect(res.score.value).toBe(39);
    expect(res.classification).toBe('INSUFFICIENT EVIDENCE');
  });
});
