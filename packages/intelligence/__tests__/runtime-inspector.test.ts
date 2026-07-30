/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('@illumine/intelligence (Wave 17.13 Runtime Inspector Verification)', () => {
  it('should verify ExecutiveIntelligenceRuntimeInspector exists and returns null to hide debug bars', () => {
    const inspectorPath = path.resolve(__dirname, '../../../src/components/executive/ExecutiveIntelligenceRuntimeInspector.tsx');
    expect(fs.existsSync(inspectorPath)).toBe(true);

    const content = fs.readFileSync(inspectorPath, 'utf-8');
    expect(content).toContain('ExecutiveIntelligenceRuntimeInspector');
    expect(content).toContain('return null');
  });
});
