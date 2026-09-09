import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.13 Real Browser Canonical Mount - DRE)', () => {
  it('should verify DREPage.tsx uses ExecutiveDecisionGovernanceMount directly below PageHeader', () => {
    const pagePath = path.resolve(process.cwd(), 'src/components/pages/DREPage.tsx');
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toContain('ExecutiveGovernanceShell');
    expect(content).toContain('ExecutiveDecisionGovernanceMount');
    expect(content).not.toContain('ExecutiveGovernanceDebugBadge');
  });
});
