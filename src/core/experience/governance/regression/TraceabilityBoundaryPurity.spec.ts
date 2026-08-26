import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('TraceabilityBoundaryPurity', () => {
  it('should not contain any React, UI, or DOM imports in the Traceability Engine', () => {
    const enginePath = path.resolve(__dirname, '../../../../capabilities/financial/intelligence/traceability/IntelligenceTraceabilityEngine.ts');
    const content = fs.readFileSync(enginePath, 'utf8');

    expect(content).not.toMatch(/from 'react'/);
    expect(content).not.toMatch(/from '.*components'/);
    expect(content).not.toMatch(/from 'lucide-react'/);
    expect(content).not.toMatch(/<[A-Z][a-zA-Z]*\s/); // No JSX tags
  });
});
