import { describe, it, expect } from 'vitest';
import { ExecutiveAgentLearningMemory, ExecutiveAgentExecutionRuntime } from '@illumine/executive-page-intelligence';

describe('@illumine/intelligence (Wave 17.9 Agent Learning Memory Loop)', () => {
  it('should record execution memory immutably for learning loop (Fase 8)', () => {
    const initialCount = ExecutiveAgentLearningMemory.getMemoryCount();
    ExecutiveAgentExecutionRuntime.executeAction('cfo-intelligence-agent', 'Explicar variações', 'DREPage');
    const newCount = ExecutiveAgentLearningMemory.getMemoryCount();

    expect(newCount).toBeGreaterThan(initialCount);
  });
});
