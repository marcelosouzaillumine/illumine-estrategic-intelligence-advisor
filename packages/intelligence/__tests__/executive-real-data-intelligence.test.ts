/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveSignalResolver } from '@illumine/executive-decision-intelligence';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/governance (Wave 17.12 Real Data Governance)', () => {
  it('should resolve signal using active financial metrics from financial model', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-1',
      pageId: 'DREPage',
      period: '2026',
      financialData: { EBITDA: 620000, ReceitaBruta: 8450000 },
      previousPeriodFinancialData: { EBITDA: 1292200, ReceitaBruta: 9100000 }
    });
    const sig = ExecutiveSignalResolver.resolveSignal(ctx);

    expect(sig.signalTitle).toContain('Margem EBITDA');
    expect(sig.severity).toBe('CRITICAL');
  });
});
