import { describe, it } from 'node:test';
import { DreHistoricalIntegrityGuard } from '../../capabilities/financial/runtime/dre/DreHistoricalIntegrityGuard';

describe('DreHistoricalIntegrityGuard', () => {
  it('handles missing previous value', () => {
    const result = DreHistoricalIntegrityGuard.sanitizeGrowth(100, undefined);
    expect(result.isMeaningful).toBe(false);
    expect(result.growthRate).toBe(0);
    expect(result.message).toContain('limitada pela quantidade');
  });

  it('rejects growth calculation from a negative base', () => {
    const result = DreHistoricalIntegrityGuard.sanitizeGrowth(100, -50);
    expect(result.isMeaningful).toBe(false);
    expect(result.growthRate).toBe(0);
    expect(result.message).toContain('base histórica nula ou negativa');
  });

  it('rejects extreme negative variation (e.g. -4079%)', () => {
    const result = DreHistoricalIntegrityGuard.sanitizeGrowth(-400, 10);
    // growth = -41.0 (-4100%)
    expect(result.isMeaningful).toBe(false);
    expect(result.message).toContain('Variação extrema');
  });

  it('rejects extreme positive variation (e.g. +1000%)', () => {
    const result = DreHistoricalIntegrityGuard.sanitizeGrowth(110, 10);
    // growth = 10.0 (1000%)
    expect(result.isMeaningful).toBe(false);
    expect(result.message).toContain('Variação extrema');
  });

  it('accepts normal growth', () => {
    const result = DreHistoricalIntegrityGuard.sanitizeGrowth(120, 100);
    expect(result.isMeaningful).toBe(true);
    expect(result.growthRate).toBeCloseTo(0.2);
    expect(result.message).toBeNull();
  });
});
