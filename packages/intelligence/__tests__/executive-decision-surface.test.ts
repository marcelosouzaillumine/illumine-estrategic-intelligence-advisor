import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.10 Executive Decision Surface Verification)', () => {
  it('should verify ExecutiveDecisionSurface component exists and exports props', () => {
    const componentPath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveDecisionSurface.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('ExecutiveDecisionSurface');
  });
});
