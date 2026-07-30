/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveRecommendationResolver } from '@illumine/executive-decision-intelligence';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/intelligence (Wave 18.1 Recommendation Contextualization)', () => {
  it('should contextualize recommendations with company name and numeric recovery targets (ADR-068)', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-300',
      companyName: 'Varejo Express S.A.',
      pageId: 'DREPage',
      period: '2026',
      financialData: { EBITDA: 400000, ReceitaBruta: 6000000 }
    });

    const rec = ExecutiveRecommendationResolver.resolveRecommendation(ctx);

    expect(rec.recommendationText).toContain('Varejo Express S.A.');
    expect(rec.expectedImpactText).toContain('R$');
    expect(rec.confidenceScore).toBeGreaterThanOrEqual(95.0);
  });
});
