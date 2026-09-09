import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.13 Real Data Binding DRE)', () => {
  it('should verify DREPage.tsx passes real financial metrics to ExecutiveDecisionGovernanceMount', () => {
    const pagePath = path.resolve(process.cwd(), 'src/components/pages/DREPage.tsx');
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toContain('ExecutiveDecisionGovernanceMount');
    expect(content).toContain('financialData=');
  });
});

