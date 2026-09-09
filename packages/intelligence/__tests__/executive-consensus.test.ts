/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveConsensusEngine } from '../agent-council/src';

describe('@illumine/governance (Wave 18.10 Executive Consensus Engine)', () => {
  it('should calculate consensus score and evidence strength across executive opinions', () => {
    const mockOpinions = [
      { agentRole: 'CFO', perspectiveName: 'Liquidez', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 95, supportingEvidence: ['E1'], votedDecision: 'APPROVE' as const },
      { agentRole: 'COO', perspectiveName: 'Operacao', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 90, supportingEvidence: ['E2'], votedDecision: 'APPROVE' as const },
      { agentRole: 'CEO', perspectiveName: 'Estrategia', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 98, supportingEvidence: ['E3'], votedDecision: 'APPROVE' as const }
    ];

    const result = ExecutiveConsensusEngine.calculateConsensus(mockOpinions);
    expect(result.consensusScore).toBe(100);
    expect(result.conflictLevel).toBe('LOW');
  });
});
