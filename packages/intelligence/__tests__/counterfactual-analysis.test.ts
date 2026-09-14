/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { CounterfactualAnalysisEngine } from '../decision-trust-governance/src';

describe('@illumine/governance (Wave 18.10.5 Counterfactual Analysis Engine)', () => {
  it('should analyze decision sensitivity and determine if a metric variation changes recommendation', () => {
    const analysis = CounterfactualAnalysisEngine.analyzeSensitivity('EBITDA_MARGIN', 12.4, 14.4);
    expect(analysis.deltaDeltaPoints).toBe(2.0);
    expect(analysis.wouldDecisionChange).toBe(true);
  });
});
