import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.12 No Agent Surface)', () => {
  it('should verify ExecutiveAgentActionSurface returns null in TSX (ADR-066)', () => {
    const surfacePath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveAgentActionSurface.tsx');
    const content = fs.readFileSync(surfacePath, 'utf-8');

    expect(content).toContain('return null');
    expect(content).not.toContain('Superfície Tátil de Agentes Executivos');
  });
});
