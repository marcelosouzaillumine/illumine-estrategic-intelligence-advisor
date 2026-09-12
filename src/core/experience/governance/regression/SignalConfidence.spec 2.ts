import { describe, it, expect } from 'vitest';
import { SignalConfidenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalConfidenceEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

describe('SignalConfidence', () => {
  it('should return low for 1 period or empty', () => {
    expect(SignalConfidenceEngine.evaluate([])).toBe('low');
    expect(SignalConfidenceEngine.evaluate([{} as NormalizedBalanceSheet])).toBe('low');
  });

  it('should return medium for 2 periods', () => {
    expect(SignalConfidenceEngine.evaluate([{} as any, {} as any])).toBe('medium');
  });

  it('should return high for 3 or more periods', () => {
    expect(SignalConfidenceEngine.evaluate([{} as any, {} as any, {} as any])).toBe('high');
    expect(SignalConfidenceEngine.evaluate([{} as any, {} as any, {} as any, {} as any])).toBe('high');
  });
});
