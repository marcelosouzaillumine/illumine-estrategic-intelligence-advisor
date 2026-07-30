/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveRecommendationResolver } from '@illumine/executive-decision-intelligence';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/intelligence (Wave 18.2 Recommendation Execution Binding)', () => {
  it('should ensure all recommendations include execution targets and confidence scores', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-beta',
      companyName: 'Beta Corp',
      pageId: 'DREPage',
      period: '2026',
      financialData: { EBITDA: 500000, ReceitaBruta: 10000000 }
    });

    const rec = ExecutiveRecommendationResolver.resolveRecommendation(ctx);

    expect(rec.recommendationText).toContain('Beta Corp');
    expect(rec.expectedImpactText).toContain('R$');
    expect(rec.confidenceScore).toBeGreaterThanOrEqual(95.0);
  });
});
