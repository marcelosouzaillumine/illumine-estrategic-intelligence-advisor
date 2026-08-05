import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialInsightRegistry } from '../FinancialInsightRegistry';

describe('FinancialInsightRegistry', () => {
  let registry: FinancialInsightRegistry;

  beforeEach(() => {
    registry = new FinancialInsightRegistry();
  });

  it('should register and retrieve insights by severity', () => {
    registry.register({
      finding: 'PROFIT_WITHOUT_CASH',
      origin: 'CashConversionEngine',
      severity: 'HIGH',
      confidence: 90,
      period: '2025'
    });

    registry.register({
      finding: 'STABLE_MARGIN',
      origin: 'ProfitabilityRelationshipEngine',
      severity: 'LOW',
      confidence: 95,
      period: '2025'
    });

    const highFindings = registry.getBySeverity('HIGH');
    expect(highFindings.length).toBe(1);
    expect(highFindings[0].finding).toBe('PROFIT_WITHOUT_CASH');

    const criticalAndHigh = registry.getCriticalFindings();
    expect(criticalAndHigh.length).toBe(1);
  });
});
