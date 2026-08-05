import { describe, it, expect, beforeEach } from 'vitest';
import { CashConversionEngine } from '../CashConversionEngine';
import { FinancialStatementContext } from '../../../context/FinancialStatementContext';

describe('CashConversionEngine', () => {
  let engine: CashConversionEngine;

  beforeEach(() => {
    engine = new CashConversionEngine();
  });

  it('should detect PROFIT_WITHOUT_CASH when net income is positive and OCF is negative', () => {
    const context = {
      incomeStatement: { margins: { net: 10 } },
      cashFlow: { operatingCashFlow: -50 }
    } as FinancialStatementContext;

    const result = engine.evaluate(context);
    expect(result?.type).toBe('PROFIT_WITHOUT_CASH');
  });
});
