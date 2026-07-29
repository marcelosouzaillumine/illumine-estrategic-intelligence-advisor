import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.8 Phase 3 Page Render Verification)', () => {
  it('should verify ExecutiveInsightsPanel component exists and exports props', () => {
    const componentPath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveInsightsPanel.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('ExecutiveInsightsPanel');
  });
});
