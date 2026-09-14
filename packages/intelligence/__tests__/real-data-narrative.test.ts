/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionNarrativeResolver } from '@illumine/executive-decision-intelligence';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/governance (Wave 18.1 Real Data Narrative)', () => {
  it('should generate narratives containing real numerical evidence (ADR-068)', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-100',
      companyName: 'Empório do Mármore',
      pageId: 'DREPage',
      period: '2026',
      comparisonPeriod: '2025',
      financialData: { EBITDA: 620000, ReceitaBruta: 8450000 },
      previousPeriodFinancialData: { EBITDA: 1292200, ReceitaBruta: 9100000 }
    });

    const narrative = ExecutiveDecisionNarrativeResolver.resolveNarrative(ctx);

    expect(narrative.executiveHeadline).toContain('Empório do Mármore');
    expect(narrative.executiveHeadline).toContain('2026');
    expect(narrative.financialImplication).toContain('672.200');
  });
});
