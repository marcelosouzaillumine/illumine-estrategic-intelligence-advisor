/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveVotingEngine } from '../agent-council/src';

describe('@illumine/intelligence (Wave 18.10 Executive Voting Engine)', () => {
  it('should tally votes accurately across 5 executive directors', () => {
    const mockOpinions = [
      { agentRole: 'CFO', perspectiveName: 'Liquidez', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 95, supportingEvidence: ['E1'], votedDecision: 'APPROVE' as const },
      { agentRole: 'COO', perspectiveName: 'Operacao', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 90, supportingEvidence: ['E2'], votedDecision: 'APPROVE_WITH_RESERVATIONS' as const },
      { agentRole: 'CRO', perspectiveName: 'Risco', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 94, supportingEvidence: ['E3'], votedDecision: 'APPROVE' as const },
      { agentRole: 'CCO', perspectiveName: 'Comercial', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 91, supportingEvidence: ['E4'], votedDecision: 'APPROVE' as const },
      { agentRole: 'CEO', perspectiveName: 'Estrategia', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 98, supportingEvidence: ['E5'], votedDecision: 'APPROVE' as const }
    ];

    const voting = ExecutiveVotingEngine.tallyVotes(mockOpinions);
    expect(voting.approveVotes).toBe(4);
    expect(voting.approveWithReservationsVotes).toBe(1);
    expect(voting.isApproved).toBe(true);
  });
});
