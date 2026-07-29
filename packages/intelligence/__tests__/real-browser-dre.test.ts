import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.11 Real Browser Canonical Composition - DRE)', () => {
  it('should verify DREPage.tsx uses ExecutiveExperienceComposer and no ExecutiveIntelligenceDebugBadge', () => {
    const pagePath = path.resolve(process.cwd(), 'src/components/pages/DREPage.tsx');
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toContain('ExecutiveIntelligenceShell');
    expect(content).toContain('ExecutiveExperienceComposer');
    expect(content).not.toContain('ExecutiveIntelligenceDebugBadge');
  });
});
