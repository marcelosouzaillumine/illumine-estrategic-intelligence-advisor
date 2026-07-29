import { describe, it, expect } from 'vitest';
import { ExecutiveRecommendationResolver } from '@illumine/executive-decision-intelligence';

describe('@illumine/intelligence (Wave 17.12 Agent Runtime Integration)', () => {
  it('should verify agent engine serves intelligence without UI cards', () => {
    const rec = ExecutiveRecommendationResolver.resolveRecommendation({ pageId: 'BalanceSheetPage' });

    expect(rec.providingAgent).toBe('Risk Agent Engine');
    expect(rec.recommendationText).toContain('passivo financeiro');
  });
});
