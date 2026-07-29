import { describe, it, expect } from 'vitest';
import { ExecutiveAgentActionRegistry } from '@illumine/executive-page-intelligence';

describe('@illumine/intelligence (Wave 17.6 Phase 8 Agent Action Exposure Registry)', () => {
  it('should expose executive agent actions mapped to domains (Financial, Risk, Simulation, Advisory)', () => {
    const mappings = ExecutiveAgentActionRegistry.getAllMappings();
    expect(mappings.length).toBe(4);

    const financialMapping = ExecutiveAgentActionRegistry.getActionsForAgent('financial-agent');
    expect(financialMapping).toBeDefined();
    expect(financialMapping?.supportedActions).toContain('Explicar resultado');
  });
});
