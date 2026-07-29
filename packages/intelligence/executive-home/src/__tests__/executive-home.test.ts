import { describe, it, expect } from 'vitest';
import { ExecutiveHomeExperience } from '../index';

describe('@illumine/executive-home (Wave 17 Phase 1 Home Experience)', () => {
  it('should return executive home summary meeting Cognitive Load limits (ADR-049)', () => {
    const summary = ExecutiveHomeExperience.getHomeSummary();

    expect(summary.topDecisionsCount).toBeLessThanOrEqual(3);
    expect(summary.emergingRisksCount).toBeLessThanOrEqual(5);
    expect(summary.opportunitiesCount).toBeLessThanOrEqual(3);
    expect(summary.trackedActionsCount).toBeLessThanOrEqual(7);
    expect(summary.recentLearningsCount).toBeLessThanOrEqual(2);
  });
});
