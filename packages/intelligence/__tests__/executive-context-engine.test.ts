import { describe, it, expect } from 'vitest';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/intelligence (Wave 18.1 Executive Context Engine)', () => {
  it('should build canonical ExecutiveDecisionContext with all required properties (ADR-068)', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-emporio',
      companyName: 'Empório do Mármore',
      pageId: 'DREPage',
      period: '2026',
      comparisonPeriod: '2025',
      financialData: { ReceitaBruta: 10000000, EBITDA: 1500000 }
    });

    expect(ctx.companyId).toBe('comp-emporio');
    expect(ctx.companyName).toBe('Empório do Mármore');
    expect(ctx.period).toBe('2026');
    expect(ctx.comparisonPeriod).toBe('2025');
    expect(ctx.confidenceLevel).toBeGreaterThanOrEqual(98.0);
  });
});
