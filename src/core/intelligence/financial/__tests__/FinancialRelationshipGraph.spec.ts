import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialRelationshipGraph } from '../graph/FinancialRelationshipGraph';
import { FinancialStatementContext } from '../context/FinancialStatementContext';

describe('FinancialRelationshipGraph', () => {
  let graph: FinancialRelationshipGraph;

  beforeEach(() => {
    graph = new FinancialRelationshipGraph();
  });

  it('should identify VALUE_EROSION_RISK when Equity is high, Margin is low, and Cash Flow is negative', () => {
    const mockContext = {
      balanceSheet: {
        equity: { total: 1000 },
        liabilities: { total: 500 },
        assets: { total: 1500, inventory: 0 }
      },
      incomeStatement: {
        margins: { ebitda: 5, net: 5 },
        revenue: { net: 1000 }
      },
      cashFlow: {
        operatingCashFlow: -100,
        freeCashFlow: 0
      }
    } as FinancialStatementContext;

    const relationships = graph.evaluate(mockContext);
    
    expect(relationships.length).toBeGreaterThan(0);
    expect(relationships[0].type).toBe('VALUE_EROSION_RISK');
    expect(relationships[0].confidence).toBeGreaterThan(0.9);
  });

  it('should not identify VALUE_EROSION_RISK if Cash Flow is positive', () => {
    const mockContext = {
      balanceSheet: {
        equity: { total: 1000 },
        liabilities: { total: 500 },
        assets: { total: 1500, inventory: 0 }
      },
      incomeStatement: {
        margins: { ebitda: 5, net: 5 },
        revenue: { net: 1000 }
      },
      cashFlow: {
        operatingCashFlow: 100,
        freeCashFlow: 0
      }
    } as FinancialStatementContext;

    const relationships = graph.evaluate(mockContext);
    
    expect(relationships.some(r => r.type === 'VALUE_EROSION_RISK')).toBe(false);
  });
});
