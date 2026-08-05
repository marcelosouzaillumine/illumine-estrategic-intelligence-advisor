import { describe, it, expect, beforeEach } from 'vitest';
import { ProfitabilityRelationshipEngine } from '../ProfitabilityRelationshipEngine';
import { FinancialPerformanceContext } from '../../context/FinancialPerformanceContext';
import { FinancialStatementContext } from '../../../context/FinancialStatementContext';

describe('ProfitabilityRelationshipEngine', () => {
  let engine: ProfitabilityRelationshipEngine;

  beforeEach(() => {
    engine = new ProfitabilityRelationshipEngine();
  });

  it('should detect VALUE_DESTRUCTION_RISK when revenue grows but margin drops and cash is negative', () => {
    const perfContext = {
      revenueGrowth: 20, // > 5 (Growing)
      ebitdaMargin: 5 // < 10 (Falling)
    } as FinancialPerformanceContext;

    const fullContext = {
      cashFlow: { operatingCashFlow: -100 }
    } as FinancialStatementContext;

    const rels = engine.evaluate(perfContext, fullContext);
    
    expect(rels.some(r => r.type === 'VALUE_DESTRUCTION_RISK')).toBe(true);
  });
});
