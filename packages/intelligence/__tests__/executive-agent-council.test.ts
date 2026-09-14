/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { ExecutiveCouncil } from '../agent-council/src';

describe('@illumine/governance (Wave 18.10 AI Agent Council)', () => {
  it('should deliberate across CFO, COO, CRO, CCO and CEO agents in a unified council decision (AAC v1.0)', () => {
    const mockContext: ExecutiveDecisionContext = {
      companyId: 'company-granatum',
      period: '2026',
      industrySector: 'TECNOLOGIA',
      hasDfcData: true,
      hasDreData: true,
      hasBpData: true,
      dataQualityScore: 98,
      dataFreshnessDays: 1
    };

    const decision = ExecutiveCouncil.deliberate(mockContext);
    expect(decision.companyId).toBe('company-granatum');
    expect(decision.financialOpinion.agentRole).toBe('CFO');
    expect(decision.operationalOpinion.agentRole).toBe('COO');
    expect(decision.riskOpinion.agentRole).toBe('CRO');
    expect(decision.commercialOpinion.agentRole).toBe('CCO');
    expect(decision.strategicOpinion.agentRole).toBe('CEO');
    expect(decision.votingSummary.approveVotes).toBeGreaterThan(0);
  });
});
