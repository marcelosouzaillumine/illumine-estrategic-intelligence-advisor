import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveDecisionMemory } from '../ExecutiveDecisionMemory';
import { DecisionStatus } from '../contracts/DecisionStatus';

describe('ExecutiveDecisionMemory', () => {
  let memory: ExecutiveDecisionMemory;

  beforeEach(() => {
    memory = new ExecutiveDecisionMemory();
  });

  it('should register a human decision and change its state', () => {
    const record = memory.logDecisionExploration('Expansão', ['A', 'B']);
    expect(record.status).toBe(DecisionStatus.EXPLORING);

    const updated = memory.registerHumanDecision(record.id, 'A', 'Impacto Alto', ['CAC'], '2026-03-01');
    expect(updated).toBeDefined();
    expect(updated!.status).toBe(DecisionStatus.APPROVED_BY_HUMAN);
  });
});
