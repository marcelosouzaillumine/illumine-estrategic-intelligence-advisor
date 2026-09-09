/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';

describe('@illumine/governance (Wave 18.1 Runtime Governance Recalculation)', () => {
  it('should recalculate decision governance dynamically when financial metrics change (ADR-068)', () => {
    const resLow = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-1',
      companyName: 'Empresa Beta',
      pageId: 'DREPage',
      period: '2026',
      financialData: { EBITDA: 500000, ReceitaBruta: 10000000 }
    });

    const resHigh = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-1',
      companyName: 'Empresa Beta',
      pageId: 'DREPage',
      period: '2026',
      financialData: { EBITDA: 2000000, ReceitaBruta: 10000000 }
    });

    expect(resLow.recommendation.providingAgent).toBe('Financial Agent Engine');
    expect(resHigh.recommendation.providingAgent).toBe('Advisory Council Engine');
    expect(resLow.recommendation.recommendationText).not.toEqual(resHigh.recommendation.recommendationText);
  });
});
