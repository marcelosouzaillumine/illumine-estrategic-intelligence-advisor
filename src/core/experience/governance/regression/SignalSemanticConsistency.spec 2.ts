import { describe, it, expect } from 'vitest';
import { SignalIntelligenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalIntelligenceEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

describe('SignalSemanticConsistency', () => {
  const getMockHistory = (metrics: number[]): NormalizedBalanceSheet[] => {
    return metrics.map((val, i) => ({
      year: 2020 + i,
      assets: { currentAssets: 0, nonCurrentAssets: 0, cashAndEquivalents: 0, accountsReceivable: 0, inventory: val, fixedAssets: 0, total: 1000 },
      liabilities: { currentLiabilities: 0, nonCurrentLiabilities: 0, suppliers: 0, laborObligations: 0, taxes: 0, financialDebtsShortTerm: 0, financialDebtsLongTerm: 0, total: 500 },
      equity: { capital: 0, retainedEarnings: 0, total: 500 }
    }));
  };

  it('should not allow high confidence with less than 3 periods', () => {
    const exposures = [{ id: 'test', category: 'LIQUIDITY', severity: 'HIGH', metric: 'Test', value: 0.5, message: 'Test message.' }];
    
    // 1 period
    let signals = SignalIntelligenceEngine.synthesize(exposures, getMockHistory([500]), getMockHistory([500])[0]);
    expect(signals[0].confidence).not.toBe('high');

    // 2 periods
    signals = SignalIntelligenceEngine.synthesize(exposures, getMockHistory([500, 500]), getMockHistory([500, 500])[1]);
    expect(signals[0].confidence).not.toBe('high');
  });

  it('should not allow structural persistence for an isolated occurrence', () => {
    const exposures = [{ id: 'inventory_concentration_monitor', category: 'WORKING_CAPITAL', severity: 'HIGH', metric: 'Test', value: 0.5, message: 'Test message.' }];
    
    // 200 is structural trigger usually, but we have 100, 100, 300 (only last period triggers)
    const signals = SignalIntelligenceEngine.synthesize(exposures, getMockHistory([100, 100, 300]), getMockHistory([100, 100, 300])[2]);
    expect(signals[0].persistence).not.toBe('structural');
  });

  it('should guarantee no prescriptive language in interpretation', () => {
    const exposures = [{ id: 'test', category: 'LIQUIDITY', severity: 'HIGH', metric: 'Test', value: 0.5, message: 'Test message.' }];
    const signals = SignalIntelligenceEngine.synthesize(exposures, getMockHistory([500]), getMockHistory([500])[0]);
    
    const interpretation = signals[0].interpretation.text.toLowerCase();
    
    // No recommendations allowed
    expect(interpretation).not.toContain('recomenda-se');
    expect(interpretation).not.toContain('a empresa deve');
    expect(interpretation).not.toContain('precisa rever');
    expect(interpretation).not.toContain('a diretoria deve');
  });
});
