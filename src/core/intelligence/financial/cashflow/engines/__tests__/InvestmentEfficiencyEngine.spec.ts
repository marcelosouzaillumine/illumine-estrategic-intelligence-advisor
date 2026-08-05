import { describe, it, expect, beforeEach } from 'vitest';
import { InvestmentEfficiencyEngine } from '../InvestmentEfficiencyEngine';
import { FinancialStatementContext } from '../../../context/FinancialStatementContext';

describe('InvestmentEfficiencyEngine', () => {
  let engine: InvestmentEfficiencyEngine;

  beforeEach(() => {
    engine = new InvestmentEfficiencyEngine();
  });

  it('should detect STRATEGIC_INVESTMENT when CAPEX is high and growth is high', () => {
    const context = {
      incomeStatement: { revenue: { net: 1000 } },
      cashFlow: { investingCashFlow: -150 } // absolute 150 > 10% of 1000
    } as FinancialStatementContext;

    const result = engine.evaluate(context, 15); // > 10 growth
    expect(result?.type).toBe('STRATEGIC_INVESTMENT');
  });
});
