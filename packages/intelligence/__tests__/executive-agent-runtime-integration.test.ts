/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveRecommendationResolver } from '@illumine/executive-decision-intelligence';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/intelligence (Wave 17.12 Agent Runtime Integration)', () => {
  it('should verify agent engine serves intelligence without UI cards', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-1',
      pageId: 'BalanceSheetPage',
      period: '2026',
      financialData: { EBITDA: 1200000, ReceitaBruta: 10000000 }
    });
    const rec = ExecutiveRecommendationResolver.resolveRecommendation(ctx);

    expect(rec.providingAgent).toBe('Risk Agent Engine');
    expect(rec.recommendationText).toContain('Empresa');
  });
});
