import { describe, it, expect } from 'vitest';
import { IntelligenceTraceabilityEngine } from '../../../../capabilities/financial/intelligence/traceability/IntelligenceTraceabilityEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

describe('TraceabilityNoFabrication', () => {
  it('should not fabricate an account if it does not exist in the source data', () => {
    const exposure = { id: 'inventory_concentration_monitor', category: 'WORKING_CAPITAL', severity: 'HIGH', metric: 'Estoques', value: 0.5, message: 'Test message.' };
    
    // Passing a balance sheet WITHOUT inventory property
    const current = { year: 2025, assets: { total: 1000 }, liabilities: { total: 1000 }, equity: { total: 0 } } as any;
    
    const trace = IntelligenceTraceabilityEngine.synthesize(exposure, current);
    
    expect(trace.account).toBeUndefined();
    expect(trace.calculation).toBeUndefined();
    expect(trace.evidenceLevel).toBe('aggregated');
  });
});
