import { describe, it, expect } from 'vitest';
import { SignalPersistenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalPersistenceEngine';
import { FinancialRiskEngine } from '../../../../capabilities/financial/intelligence/financial-health/FinancialRiskEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

describe('SignalPersistence', () => {
  const getMockHistory = (metrics: number[]): NormalizedBalanceSheet[] => {
    return metrics.map((val, i) => ({
      year: 2020 + i,
      assets: { currentAssets: 0, nonCurrentAssets: 0, cashAndEquivalents: 0, accountsReceivable: 0, inventory: val, fixedAssets: 0, total: 1000 },
      liabilities: { currentLiabilities: 0, nonCurrentLiabilities: 0, suppliers: 0, laborObligations: 0, taxes: 0, financialDebtsShortTerm: 0, financialDebtsLongTerm: 0, total: 500 },
      equity: { capital: 0, retainedEarnings: 0, total: 500 }
    }));
  };

  it('should return structural when the signal repeats continuously', () => {
    // Inventory concentration > 20% in the last 3 periods (200, 250, 300)
    const history = getMockHistory([200, 250, 300]);
    expect(SignalPersistenceEngine.evaluate('inventory_concentration_monitor', history, (p) => FinancialRiskEngine.analyze(p))).toBe('structural');
  });

  it('should return conjunctural when the signal occurs only in the most recent period', () => {
    // Inventory concentration < 20% in earlier periods, then > 20% in the last period
    const history = getMockHistory([100, 100, 300]);
    expect(SignalPersistenceEngine.evaluate('inventory_concentration_monitor', history, (p) => FinancialRiskEngine.analyze(p))).toBe('conjunctural');
  });

  it('should return unknown when history is insufficient', () => {
    // Only 1 period
    const history = getMockHistory([300]);
    expect(SignalPersistenceEngine.evaluate('any_metric', null as any, (p) => FinancialRiskEngine.analyze(p))).toBe('unknown');
    expect(SignalPersistenceEngine.evaluate('any_metric', [], (p) => FinancialRiskEngine.analyze(p))).toBe('unknown');
  });
});
