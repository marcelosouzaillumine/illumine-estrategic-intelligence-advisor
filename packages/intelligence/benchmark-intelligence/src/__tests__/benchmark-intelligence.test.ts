import { describe, it, expect } from 'vitest';
import { PerformanceBaseline, GapAnalysisEngine } from '../index';

describe('@illumine/benchmark-governance (Wave 14 Phase 4)', () => {
  it('should evaluate gap analysis against historical baseline and strategic target', () => {
    const baseline: PerformanceBaseline = {
      baselineId: 'base-ebitda',
      metricCode: 'EBITDA_MARGIN',
      historicalAverage: 18.0,
      strategicTarget: 25.0,
      period: '2026'
    };

    const res = GapAnalysisEngine.evaluateGap(baseline, 22.0);
    expect(res.gapToBaseline).toBe(4.0); // 22.0 - 18.0 = +4.0
    expect(res.gapToTarget).toBe(-3.0);   // 22.0 - 25.0 = -3.0
    expect(res.status).toBe('BEHIND_TARGET');
  });
});
