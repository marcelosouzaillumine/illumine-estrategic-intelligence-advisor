import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/executive-simulation-engine (Wave 15C Agent Performance)', () => {
  it('should verify ADR-031 Agent Performance Measurement Standard is active', () => {
    const adrPath = path.resolve(process.cwd(), 'ADR-031.md');
    const content = fs.readFileSync(adrPath, 'utf-8');

    expect(content).toContain('Agent Performance Measurement Standard');
    expect(content).toContain('Recommendation Accuracy');
    expect(content).toContain('Approval Rate');
  });
});
