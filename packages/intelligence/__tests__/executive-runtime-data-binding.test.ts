import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionLayer } from '@illumine/executive-experience-composer';

describe('@illumine/intelligence (Wave 17.11 Real Runtime Data Binding)', () => {
  it('should bind decision view to active financial metrics from financial model', () => {
    const res = ExecutiveDecisionLayer.resolveDecisionView({
      companyId: 'comp-100',
      userId: 'user-ceo',
      pageId: 'DREPage',
      period: '2026',
      activeFinancialMetrics: { EBITDA: 1500000 }
    });

    expect(res.opportunityDetail).toContain('EBITDA atual em R$ 1.500.000');
    expect(res.anchorAgentName).toBe('Financial Agent');
  });
});
