import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 15A Agent Capability Registry Validation)', () => {
  it('should validate that 100% of registered agents have capabilities, engines, and autonomyLevel set to 2', () => {
    const registryPath = path.resolve(process.cwd(), 'agent-capability-registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

    registry.agents.forEach((agent: any) => {
      expect(agent.agentId).toBeDefined();
      expect(agent.capabilities.length).toBeGreaterThan(0);
      expect(agent.engines.length).toBeGreaterThan(0);
      expect(agent.autonomyLevel).toBe(2); // Governed Executive Recommendation Cap
    });
  });
});
