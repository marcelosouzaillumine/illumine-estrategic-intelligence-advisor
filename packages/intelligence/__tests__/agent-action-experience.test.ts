import { describe, it, expect } from 'vitest';
import { ExecutiveAgentActionRegistry } from '@illumine/executive-page-intelligence';

describe('@illumine/intelligence (Wave 17.10 Agent Action Experience Verification)', () => {
  it('should verify all 4 core executive agent action domains are exposed', () => {
    const mappings = ExecutiveAgentActionRegistry.getAllMappings();
    const domains = mappings.map(m => m.domainName);

    expect(domains).toContain('Financial');
    expect(domains).toContain('Risk');
    expect(domains).toContain('Simulation');
    expect(domains).toContain('Advisory');
  });
});
