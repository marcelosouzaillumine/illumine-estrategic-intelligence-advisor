import { describe, it, expect, beforeEach } from 'vitest';
import { CashFlowRelationshipEngine } from '../CashFlowRelationshipEngine';
import { FinancialStatementContext } from '../../../context/FinancialStatementContext';
import { FinancialPerformanceContext } from '../../../performance/context/FinancialPerformanceContext';

describe('CashFlowRelationshipEngine', () => {
  let engine: CashFlowRelationshipEngine;

  beforeEach(() => {
    engine = new CashFlowRelationshipEngine();
  });

  it('should detect WORKING_CAPITAL_PRESSURE when growth is high, receivables are high, and cash is negative', () => {
    const fullContext = {
      incomeStatement: { revenue: { net: 1000 } },
      balanceSheet: { assets: { receivables: 400 } }, // 40% of revenue
      cashFlow: { operatingCashFlow: -50 }
    } as FinancialStatementContext;

    const perfContext = {
      revenueGrowth: 40
    } as FinancialPerformanceContext;

    const result = engine.evaluate(perfContext, fullContext);
    expect(result?.type).toBe('WORKING_CAPITAL_PRESSURE');
  });
});
