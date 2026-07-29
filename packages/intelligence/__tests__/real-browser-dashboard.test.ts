import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.11 Real Browser Canonical Composition - Dashboard)', () => {
  it('should verify DashboardPage.tsx uses ExecutiveExperienceComposer and no ExecutiveIntelligenceDebugBadge', () => {
    const pagePath = path.resolve(process.cwd(), 'src/components/pages/DashboardPage.tsx');
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toContain('ExecutiveIntelligenceShell');
    expect(content).toContain('ExecutiveExperienceComposer');
    expect(content).not.toContain('ExecutiveIntelligenceDebugBadge');
  });
});
