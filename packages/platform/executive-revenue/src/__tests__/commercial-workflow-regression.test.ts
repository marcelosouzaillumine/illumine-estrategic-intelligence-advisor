/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveLeadEngine, ExecutiveProposalEngine } from '../index';

describe('Quality Gate 8 — Commercial Workflow Regression Test', () => {
  it('should guarantee seamless commercial workflow from Lead to Proposal generation', () => {
    const crm = ExecutiveLeadEngine.getActiveCRM();
    const topOpp = crm.opportunities[0];
    const proposal = ExecutiveProposalEngine.generateProposal(topOpp.companyName, topOpp.expectedValue);

    expect(proposal.companyName).toBe(topOpp.companyName);
    expect(proposal.status).toBe('SENT');
  });
});
