import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 15A Agent Impact Model Validation)', () => {
  it('should verify that 100% of agents are coupled to measurable economic impact KPIs (ADR-023)', () => {
    const registryPath = path.resolve(process.cwd(), 'agent-capability-registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

    registry.agents.forEach((agent: any) => {
      expect(agent.impactKpis).toBeDefined();
      expect(agent.impactKpis.length).toBeGreaterThan(0);
    });
  });
});
