import { describe, it, expect } from 'vitest';
import { AdvisoryValueRealizationEngine } from '../index';

describe('@illumine/advisory-workflow-engine (Wave 15D Phase 5 Value Realization)', () => {
  it('should calculate Executive Advisory ROI Score and impact metrics (ADR-036)', () => {
    const result = AdvisoryValueRealizationEngine.calculateAdvisoryRoi(95, 90, 88);
    expect(result.roiScore.value).toBe(91);
    expect(result.ebitdaImprovementRealized).toBe(950000);
    expect(result.productivityGainPct).toBe(9.0);
  });
});
