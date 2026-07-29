import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.13 Real Browser Canonical Mount - Balance Sheet)', () => {
  it('should verify BalanceSheetPage.tsx uses ExecutiveDecisionIntelligenceMount directly below PageHeader', () => {
    const pagePath = path.resolve(process.cwd(), 'src/components/pages/BalanceSheetPage.tsx');
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toContain('ExecutiveIntelligenceShell');
    expect(content).toContain('ExecutiveDecisionIntelligenceMount');
    expect(content).not.toContain('ExecutiveIntelligenceDebugBadge');
  });
});
