import { describe, it, expect, beforeEach } from 'vitest';
import { EarningsQualityEngine } from '../EarningsQualityEngine';
import { FinancialStatementContext } from '../../../context/FinancialStatementContext';

describe('EarningsQualityEngine', () => {
  let engine: EarningsQualityEngine;

  beforeEach(() => {
    engine = new EarningsQualityEngine();
  });

  it('should detect LOW_CASH_CONVERSION when net income is positive but cash flow is negative', () => {
    const fullContext = {
      incomeStatement: { margins: { net: 10 } },
      cashFlow: { operatingCashFlow: -50 }
    } as FinancialStatementContext;

    const quality = engine.evaluate(fullContext);
    
    expect(quality?.status).toBe('LOW_CASH_CONVERSION');
  });

  it('should detect HIGH_QUALITY_EARNINGS when both net income and cash flow are positive', () => {
    const fullContext = {
      incomeStatement: { margins: { net: 10 } },
      cashFlow: { operatingCashFlow: 50 }
    } as FinancialStatementContext;

    const quality = engine.evaluate(fullContext);
    
    expect(quality?.status).toBe('HIGH_QUALITY_EARNINGS');
  });
});
