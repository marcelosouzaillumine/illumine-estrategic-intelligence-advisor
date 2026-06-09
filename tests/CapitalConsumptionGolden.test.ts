import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PatrimonialPreservationEngine } from '../src/core/runtime/governance/bp/PatrimonialPreservationEngine';

describe('CapitalConsumption Golden Test', () => {
  it('should calculate 22.5% consumed capital for Granatum 2023', () => {
    const summary = {
      lucrosPrejuizos: 60536.59,
      capitalSocial: 269051.51
    };
    
    const result = PatrimonialPreservationEngine.getConsumptionMetrics(summary as any);
    
    assert.strictEqual(result.capitalConsumedAmount, 60536.59);
    assert.strictEqual(result.capitalConsumedPercent, 22.5);
    assert.strictEqual(result.capitalConsumptionBase, 269051.51);
  });

  it('should return INSUFFICIENT_DATA if capital social is missing', () => {
    const summary = {
      lucrosPrejuizos: 60536.59,
      capitalSocial: 0
    };
    
    const result = PatrimonialPreservationEngine.getConsumptionMetrics(summary as any);
    
    assert.strictEqual(result.capitalConsumedPercent, 'INSUFFICIENT_DATA');
  });
});
