import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialDecisionEngine } from '../FinancialDecisionEngine';
import { FinancialDecisionOption } from '../FinancialDecisionOption';
import { RankedOpportunity } from '../OpportunityRankingEngine';

describe('FinancialDecisionEngine', () => {
  let engine: FinancialDecisionEngine;

  beforeEach(() => {
    engine = new FinancialDecisionEngine();
  });

  it('should generate a comprehensive decision context from diagnosis, options and rankings', () => {
    const diagnosisOutput = {
      diagnosis: 'Test',
      hypotheses: [],
      strategicImplications: [],
      opportunities: [],
      cfoQuestions: ['Q1']
    };

    const options: FinancialDecisionOption[] = [
      {
        id: '1', title: 'Option 1', category: 'GROWTH', triggerConcepts: [], rationale: '',
        expectedImpact: { financial: '', operational: '', strategic: '' }, risks: [], prerequisites: [],
        confidence: 0.9, governance: { requiresHumanApproval: true, evidence: [], confidence: 0.9, limitations: [] }
      }
    ];

    const ranked: RankedOpportunity[] = [
      { option: options[0], score: 8, priority: 'Alta', complexityScore: 5, riskScore: 5, impactScore: 9 }
    ];

    const context = engine.structureContext(diagnosisOutput, options, ranked);
    
    expect(context.unansweredQuestions.length).toBeGreaterThan(0);
    expect(context.options.length).toBe(1);
    expect(context.diagnosis).toBe('Test');
  });
});
