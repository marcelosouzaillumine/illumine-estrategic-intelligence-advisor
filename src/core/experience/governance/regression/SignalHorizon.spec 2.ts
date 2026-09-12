import { describe, it, expect } from 'vitest';
import { SignalHorizonEngine } from '../../../../capabilities/financial/intelligence/signals/SignalHorizonEngine';

describe('SignalHorizon', () => {
  it('should return short_term for liquidity signals', () => {
    expect(SignalHorizonEngine.evaluate('liquidity', 'some_metric')).toBe('short_term');
    expect(SignalHorizonEngine.evaluate('LIQUIDITY', 'some_metric')).toBe('short_term');
  });

  it('should return medium_term for working_capital or inventory signals', () => {
    expect(SignalHorizonEngine.evaluate('working_capital', 'some_metric')).toBe('medium_term');
    expect(SignalHorizonEngine.evaluate('other', 'inventory_concentration')).toBe('medium_term');
  });

  it('should return long_term for capital_structure or solvency signals', () => {
    expect(SignalHorizonEngine.evaluate('capital_structure', 'some_metric')).toBe('long_term');
    expect(SignalHorizonEngine.evaluate('solvency', 'some_metric')).toBe('long_term');
    expect(SignalHorizonEngine.evaluate('other', 'debt_ratio')).toBe('long_term');
  });

  it('should return unknown for unrecognized signals', () => {
    expect(SignalHorizonEngine.evaluate('unknown', 'unknown_metric')).toBe('unknown');
  });
});
