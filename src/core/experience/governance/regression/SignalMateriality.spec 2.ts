import { describe, it, expect } from 'vitest';
import { SignalMaterialityEngine } from '../../../../capabilities/financial/intelligence/signals/SignalMaterialityEngine';

describe('SignalMateriality', () => {
  it('should return critical when value >= 50%', () => {
    expect(SignalMaterialityEngine.evaluate(0.5, 'liquidity')).toBe('critical');
    expect(SignalMaterialityEngine.evaluate(0.6, 'liquidity')).toBe('critical');
  });

  it('should return high when value >= 30% and < 50%', () => {
    expect(SignalMaterialityEngine.evaluate(0.3, 'liquidity')).toBe('high');
    expect(SignalMaterialityEngine.evaluate(0.49, 'liquidity')).toBe('high');
  });

  it('should return moderate when value >= 10% and < 30%', () => {
    expect(SignalMaterialityEngine.evaluate(0.1, 'liquidity')).toBe('moderate');
    expect(SignalMaterialityEngine.evaluate(0.29, 'liquidity')).toBe('moderate');
  });

  it('should return low when value < 10%', () => {
    expect(SignalMaterialityEngine.evaluate(0.09, 'liquidity')).toBe('low');
    expect(SignalMaterialityEngine.evaluate(0, 'liquidity')).toBe('low');
  });
});
