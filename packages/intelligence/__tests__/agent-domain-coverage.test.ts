import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 15A Agent Domain Coverage)', () => {
  it('should verify that all 12 canonical agents exist in agent-capability-registry.json with 0 missing domains', () => {
    const registryPath = path.resolve(process.cwd(), 'agent-capability-registry.json');
    const content = fs.readFileSync(registryPath, 'utf-8');
    const registry = JSON.parse(content);

    expect(registry.agents).toBeDefined();
    expect(registry.agents.length).toBe(12);

    const domains = registry.agents.map((a: any) => a.domain);
    const expectedDomains = [
      'finance',
      'controladoria',
      'governance',
      'strategy',
      'commercial',
      'customer',
      'operations',
      'people',
      'risk',
      'innovation',
      'decision',
      'orchestration'
    ];

    expectedDomains.forEach(dom => {
      expect(domains).toContain(dom);
    });
  });
});
