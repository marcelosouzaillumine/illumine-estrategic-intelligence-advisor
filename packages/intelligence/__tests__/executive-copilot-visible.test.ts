import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.8 Phase 5 Copilot Visibility Verification)', () => {
  it('should verify ExecutiveIntelligenceShell mounts Executive Copilot floating trigger', () => {
    const shellPath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveIntelligenceShell.tsx');
    expect(fs.existsSync(shellPath)).toBe(true);
    const content = fs.readFileSync(shellPath, 'utf-8');
    expect(content).toContain('Executive Copilot');
    expect(content).toContain('fixed bottom-6 right-6');
  });
});
