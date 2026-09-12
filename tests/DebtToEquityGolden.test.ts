import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DebtToEquityEngine } from '../src/capabilities/runtime/governance/bp/DebtToEquityEngine';

describe('DebtToEquity Golden Test', () => {
  it('should calculate 0.35x for Granatum 2023', () => {
    const summary = {
      passivoTotal: 73160.99,
      patrimonioLiquido: 207999.77
    };
    
    const result = DebtToEquityEngine.calculate(summary as any);
    
    assert.strictEqual(result.value, '0.35x');
    assert.strictEqual(result.classification, 'HEALTHY');
  });

  it('should return N/A if missing data', () => {
    const summary = {
      passivoTotal: NaN,
      patrimonioLiquido: 207999.77
    };
    
    const result = DebtToEquityEngine.calculate(summary as any);
    
    assert.strictEqual(result.value, 'N/A');
  });
});
