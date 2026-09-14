import { describe, it, expect } from 'vitest';
import { SignalIntelligenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalIntelligenceEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

describe('GovernanceTraceability', () => {
  it('should ensure every valid signal has traceability', () => {
    const exposures = [{ id: 'inventory_concentration_monitor', category: 'WORKING_CAPITAL', severity: 'HIGH', metric: 'Estoques', value: 0.5, message: 'Test message.' }];
    const current = { year: 2025, assets: { inventory: 500, total: 1000 }, liabilities: { total: 1000 }, equity: { total: 0 } } as NormalizedBalanceSheet;
    
    const signals = SignalIntelligenceEngine.synthesize(exposures, [current], current);
    
    expect(signals[0].traceability).toBeDefined();
    expect(signals[0].traceability?.sourceType).toBe('balance_sheet');
  });
});
