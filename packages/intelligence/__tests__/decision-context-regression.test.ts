/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';

describe('@illumine/intelligence (Wave 18.1 Decision Context Regression Safety)', () => {
  it('should verify zero static page-id switches remain in decision intelligence engine (ADR-068)', () => {
    const res = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-test',
      companyName: 'Empresa Teste',
      pageId: 'AnyArbitraryPage',
      period: '2026'
    });

    expect(res.signal.signalTitle).toContain('Empresa Teste');
    expect(res.recommendation.recommendationText).toContain('Empresa Teste');
    expect(res.narrative.executiveHeadline).toContain('Empresa Teste');
  });
});
