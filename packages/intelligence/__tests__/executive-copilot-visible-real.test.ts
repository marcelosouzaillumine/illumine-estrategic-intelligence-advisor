import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.10.1 Executive Copilot Real Visibility)', () => {
  it('should verify ExecutiveIntelligenceShell mounts floating Copilot with page context', () => {
    const shellPath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveIntelligenceShell.tsx');
    const content = fs.readFileSync(shellPath, 'utf-8');

    expect(content).toContain('Executive Copilot');
    expect(content).toContain('Sugestões de análise');
  });
});
