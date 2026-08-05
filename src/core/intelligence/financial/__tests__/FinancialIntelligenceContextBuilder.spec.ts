import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialIntelligenceContextBuilder } from '../builder/FinancialIntelligenceContextBuilder';
import { FinancialFact } from '../facts/FinancialFact';

describe('FinancialIntelligenceContextBuilder', () => {
  let builder: FinancialIntelligenceContextBuilder;

  beforeEach(() => {
    builder = new FinancialIntelligenceContextBuilder();
  });

  it('should orchestrate raw data into a fully formed FinancialStatementContext including macro relationships', () => {
    const facts: FinancialFact[] = [
      { metric: 'current_ratio', value: 1.5, period: '2025', source: 'BALANCE_SHEET' }
    ];

    const rawBalanceSheet = {
      equity: { total: 1000 },
      liabilities: { total: 500 },
      assets: { total: 1500, inventory: 500 } // high inventory
    };

    const rawIncomeStatement = {
      revenue: { net: 1000 },
      margins: { ebitda: 5, net: 20 } // low ebitda, but high net (mock scenario)
    };

    const rawCashFlow = {
      operatingCashFlow: -100, // triggers erosion risk
      freeCashFlow: 10 // triggers cash trap
    };

    const context = builder.buildContext(
      'tenant-1',
      'company-1',
      '2025',
      rawBalanceSheet,
      rawIncomeStatement,
      rawCashFlow,
      facts
    );

    // Verify metadata
    expect(context.tenantId).toBe('tenant-1');
    expect(context.companyId).toBe('company-1');
    expect(context.period).toBe('2025');

    // Verify Facts insertion
    expect(context.balanceSheet.facts.length).toBe(1);
    expect(context.balanceSheet.facts[0].metric).toBe('current_ratio');

    // Verify relationships calculation (graph execution)
    expect(context.relationships.length).toBe(2);
    expect(context.relationships.some(r => r.type === 'VALUE_EROSION_RISK')).toBe(true);
    expect(context.relationships.some(r => r.type === 'CASH_TRAP')).toBe(true);
  });
});
