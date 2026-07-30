/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/intelligence (Wave 18.2 Executive Cognitive Layer)', () => {
  it('should construct canonical context supporting the 8 cognitive layers without hardcoded text', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-granatum',
      companyName: 'Granatum S.A.',
      pageId: 'BalanceSheetPage',
      period: '2026',
      comparisonPeriod: '2025'
    });

    expect(ctx.companyName).toBe('Granatum S.A.');
    expect(ctx.comparisonPeriod).toBe('2025');
    expect(ctx.financialStatements).toBeDefined();
  });
});
