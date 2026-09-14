/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveSignalResolver } from '@illumine/executive-decision-intelligence';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/governance (Wave 18.1 Comparison Engine)', () => {
  it('should calculate temporal comparison and delta in percentage points (ADR-068)', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-100',
      companyName: 'Granatum S.A.',
      pageId: 'DREPage',
      period: '2026',
      comparisonPeriod: '2025',
      financialData: { ReceitaBruta: 10000000, EBITDA: 1000000 },
      previousPeriodFinancialData: { ReceitaBruta: 10000000, EBITDA: 1500000 }
    });

    const sig = ExecutiveSignalResolver.resolveSignal(ctx);

    expect(sig.signalTitle).toContain('Granatum S.A.');
    expect(sig.signalTitle).toContain('15.0% para 10.0%');
    expect(sig.signalTitle).toContain('-5 p.p.');
  });
});
