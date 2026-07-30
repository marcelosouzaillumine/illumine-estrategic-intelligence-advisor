/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveProposalEngine } from '../index';

describe('Quality Gate 2 — Executive Proposal Quality Test', () => {
  it('should generate proposal incorporating investment, EBITDA gain and payback', () => {
    const proposal = ExecutiveProposalEngine.generateProposal('Empresa Teste', 100000);

    expect(proposal.annualInvestmentValue).toBe(100000);
    expect(proposal.projectedEbitdaGain).toBe(550000);
    expect(proposal.projectedPaybackMonths).toBe(1.5);
  });
});
