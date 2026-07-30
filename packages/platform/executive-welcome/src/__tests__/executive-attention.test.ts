/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveAttentionEngine } from '../index';

describe('Quality Gate 4 — Executive Attention Funnel Test', () => {
  it('should filter 148 indicators into 1 single critical decision', () => {
    const attention = ExecutiveAttentionEngine.calculateExecutiveAttention();

    expect(attention.totalIndicatorsEvaluatedCount).toBe(148);
    expect(attention.totalEventsCapturedCount).toBe(29);
    expect(attention.totalAnalysesCompletedCount).toBe(8);
    expect(attention.totalRecommendationsGeneratedCount).toBe(4);
    expect(attention.topPrioritiesCount).toBe(2);
    expect(attention.singleCriticalDecisionTitle).toBeDefined();
  });
});
