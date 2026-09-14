import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.13 Decision Mount Architecture)', () => {
  it('should verify ExecutiveDecisionIntelligenceMount component connects engine and composer seamlessly', () => {
    const mountPath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveDecisionIntelligenceMount.tsx');
    const content = fs.readFileSync(mountPath, 'utf-8');

    expect(content).toContain('ExecutiveDecisionGovernanceEngine');
    expect(content).toContain('ExecutiveExperienceComposer');
    expect(content).toContain('ExecutiveDecisionSurface');
  });
});
