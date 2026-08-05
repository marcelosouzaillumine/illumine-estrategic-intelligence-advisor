import { describe, it, expect, beforeEach } from 'vitest';
import { CashSustainabilityEngine } from '../CashSustainabilityEngine';
import { FinancialStatementContext } from '../../../context/FinancialStatementContext';

describe('CashSustainabilityEngine', () => {
  let engine: CashSustainabilityEngine;

  beforeEach(() => {
    engine = new CashSustainabilityEngine();
  });

  it('should detect CASH_DEPENDENCY_RISK when OCF is negative and debt increases', () => {
    const context = {
      cashFlow: { 
        operatingCashFlow: -50,
        financingCashFlow: 100 // debt increasing
      }
    } as FinancialStatementContext;

    const result = engine.evaluate(context);
    expect(result?.type).toBe('CASH_DEPENDENCY_RISK');
  });
});
