import { describe, it, expect } from 'vitest';
import { ExecutiveMemoryClassifier } from '../ExecutiveMemoryClassifier';
import { MemoryGovernance } from '../MemoryGovernance';
import { ExecutiveMemoryStore } from '../ExecutiveMemoryStore';

describe('AgentMemoryIntegration', () => {
  it('should flow from conversation to governed long term memory', () => {
    const classifier = new ExecutiveMemoryClassifier();
    const governance = new MemoryGovernance();
    const store = new ExecutiveMemoryStore();

    // 1. User says something
    const rawMemory = classifier.classify('O risco de caixa aumentou', 'CFO');
    expect(rawMemory).not.toBeNull();
    
    // 2. Governance checks it
    const governedMemory = governance.validateArtifact(rawMemory!);
    expect(governedMemory.confidence).toBe('WORKING_HYPOTHESIS'); // Because a human said it, it's not a FACT

    // 3. Store it
    store.saveToLongTerm(governedMemory);

    // 4. Retrieve later
    const active = store.getActiveLongTermMemories();
    expect(active.length).toBe(1);
    expect(active[0].content).toContain('risco de caixa');
  });
});
