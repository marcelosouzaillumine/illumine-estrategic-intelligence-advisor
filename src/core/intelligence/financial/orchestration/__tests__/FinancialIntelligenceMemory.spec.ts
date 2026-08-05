import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialIntelligenceMemory } from '../FinancialIntelligenceMemory';

describe('FinancialIntelligenceMemory', () => {
  let memory: FinancialIntelligenceMemory;

  beforeEach(() => {
    memory = new FinancialIntelligenceMemory();
  });

  it('should store and retrieve history in chronological order', () => {
    memory.saveSnapshot('2025', { profile: 'STABLE', topRisks: [], keyEvolutions: [] });
    memory.saveSnapshot('2024', { profile: 'RISKY', topRisks: [], keyEvolutions: [] });

    const history = memory.getHistory();
    expect(history[0].period).toBe('2024');
    expect(history[1].period).toBe('2025');
  });
});
