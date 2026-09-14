/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveConflictResolver } from '../agent-council/src';

describe('@illumine/governance (Wave 18.10 Executive Conflict Resolver)', () => {
  it('should identify and resolve minor operational conflict reservations with evidence', () => {
    const mockOpinions = [
      { agentRole: 'CFO', perspectiveName: 'Liquidez', diagnosis: 'OK', proposedAction: 'Act', confidenceScore: 95, supportingEvidence: ['E1'], votedDecision: 'APPROVE' as const },
      { agentRole: 'COO', perspectiveName: 'Operacao', diagnosis: 'Gargalo de estoque', proposedAction: 'Revisar', confidenceScore: 90, supportingEvidence: ['E2'], votedDecision: 'APPROVE_WITH_RESERVATIONS' as const }
    ];

    const resolution = ExecutiveConflictResolver.resolveConflicts(mockOpinions);
    expect(resolution.hasConflict).toBe(true);
    expect(resolution.conflictExplanation).toContain('COO');
  });
});
