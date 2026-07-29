import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.11 Design System Compliance)', () => {
  it('should verify ExecutiveDecisionSurface imports Design System primitives', () => {
    const surfacePath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveDecisionSurface.tsx');
    const content = fs.readFileSync(surfacePath, 'utf-8');

    expect(content).toContain('ExecutiveSurface');
    expect(content).toContain('ExecutiveBadge');
  });
});
