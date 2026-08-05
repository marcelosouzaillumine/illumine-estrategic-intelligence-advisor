import { describe, it, expect, beforeEach } from 'vitest';
import { OpportunityRankingEngine } from '../OpportunityRankingEngine';
import { FinancialDecisionOption } from '../FinancialDecisionOption';

describe('OpportunityRankingEngine', () => {
  let engine: OpportunityRankingEngine;

  beforeEach(() => {
    engine = new OpportunityRankingEngine();
  });

  it('should properly rank GROWTH over CAPITAL_ALLOCATION when confidence is equal', () => {
    const options: FinancialDecisionOption[] = [
      {
        id: '1', title: 'A', category: 'CAPITAL_ALLOCATION', triggerConcepts: [], rationale: '',
        expectedImpact: { financial: '', operational: '', strategic: '' }, risks: [], prerequisites: [],
        confidence: 0.9, governance: { requiresHumanApproval: true, evidence: [], confidence: 0.9, limitations: [] }
      },
      {
        id: '2', title: 'B', category: 'GROWTH', triggerConcepts: [], rationale: '',
        expectedImpact: { financial: '', operational: '', strategic: '' }, risks: [], prerequisites: [],
        confidence: 0.9, governance: { requiresHumanApproval: true, evidence: [], confidence: 0.9, limitations: [] }
      }
    ];

    const ranked = engine.rankOptions(options);
    
    expect(ranked.length).toBe(2);
    expect(ranked[0].option.category).toBe('CAPITAL_ALLOCATION'); // Capital allocation has lower complexity and risk, thus higher ROI score.
    expect(ranked[1].option.category).toBe('GROWTH');
  });
});
