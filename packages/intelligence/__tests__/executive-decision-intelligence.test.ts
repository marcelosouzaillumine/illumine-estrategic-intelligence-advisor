import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';

describe('@illumine/governance (Wave 17.12 Decision Governance Engine)', () => {
  it('should evaluate page context returning signal, recommendation, narrative and decision actions (ADR-066)', () => {
    const res = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-100',
      userId: 'user-ceo',
      pageId: 'DREPage',
      period: '2026'
    });

    expect(res.signal.signalTitle).toContain('Margem EBITDA');
    expect(res.recommendation.recommendationText).toBeDefined();
    expect(res.narrative.executiveHeadline).toBeDefined();
    expect(res.actions.length).toBeGreaterThan(0);
  });
});
