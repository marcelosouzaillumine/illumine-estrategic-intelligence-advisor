import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.13 No Agent Surface Rendered)', () => {
  it('should verify ExecutiveAgentActionSurface returns null in TSX (ADR-066 / ADR-067)', () => {
    const surfacePath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveAgentActionSurface.tsx');
    const content = fs.readFileSync(surfacePath, 'utf-8');

    expect(content).toContain('return null');
  });
});
