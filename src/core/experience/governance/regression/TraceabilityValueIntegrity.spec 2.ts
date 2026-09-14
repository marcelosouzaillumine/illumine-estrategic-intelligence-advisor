import { describe, it, expect } from 'vitest';
import { SignalIntelligenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalIntelligenceEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';
import { ExecutiveFormattingService } from '../../../../capabilities/financial/intelligence/formatting/ExecutiveFormattingService';

describe('TraceabilityValueIntegrity', () => {
  it('should guarantee the displayed traceability value matches the raw source exactly via formatting', () => {
    const exposures = [{ id: 'excess_liquidity_eval', category: 'LIQUIDITY', severity: 'MEDIUM', metric: 'Caixa / Ativo Total', value: 0.2836742, message: 'Test message.' }];
    const current = { year: 2025, assets: { cashAndEquivalents: 2836742, total: 10000000 }, liabilities: { total: 0 }, equity: { total: 0 } } as NormalizedBalanceSheet;
    
    const signals = SignalIntelligenceEngine.synthesize(exposures, [current], current);
    const trace = signals[0].traceability;
    
    // We expect formatting to round to 28,37%, but the raw value must be 0.2836742 or 2836742
    expect(trace?.metric?.value).toBe(0.2836742);
    expect(trace?.metric?.formattedValue).toBe('28,4%');
    expect(trace?.account?.value).toBe(2836742);
    expect(trace?.account?.formattedValue).toBe('R$ 2.836.742');
  });
});
