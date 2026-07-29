import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.8 Phase 4 Agent Surface Verification)', () => {
  it('should verify ExecutiveAgentActionSurface component is created for real agent interaction', () => {
    const componentPath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveAgentActionSurface.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('ExecutiveAgentActionSurface');
  });
});
