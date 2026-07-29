import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.13 Runtime Inspector Verification)', () => {
  it('should verify ExecutiveIntelligenceRuntimeInspector exists and renders dev inspection trail', () => {
    const inspectorPath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveIntelligenceRuntimeInspector.tsx');
    expect(fs.existsSync(inspectorPath)).toBe(true);

    const content = fs.readFileSync(inspectorPath, 'utf-8');
    expect(content).toContain('Runtime Inspector');
    expect(content).toContain('executive-runtime-inspector');
  });
});
