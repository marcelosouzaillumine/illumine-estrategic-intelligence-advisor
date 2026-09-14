import { describe, it, expect } from 'vitest';
import { SignalIntelligenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalIntelligenceEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

describe('TraceabilityCompleteness', () => {
  it('should guarantee Signal -> Metric -> Period -> Evidence flow', () => {
    const exposures = [{ id: 'inventory_concentration_monitor', category: 'WORKING_CAPITAL', severity: 'HIGH', metric: 'Estoques / Ativo Total', value: 0.5, message: 'Test message.' }];
    const current = { year: 2025, assets: { inventory: 500, total: 1000 }, liabilities: { total: 1000 }, equity: { total: 0 } } as NormalizedBalanceSheet;
    
    const signals = SignalIntelligenceEngine.synthesize(exposures, [current], current);
    const trace = signals[0].traceability;
    
    expect(trace).toBeDefined();
    expect(trace?.metric?.name).toBe('Estoques / Ativo Total');
    expect(trace?.period.fiscalYear).toBe(2025);
    expect(trace?.evidenceLevel).toBe('derived');
    expect(trace?.calculation?.formula).toContain('Estoques ÷ Ativo Total');
  });
});
