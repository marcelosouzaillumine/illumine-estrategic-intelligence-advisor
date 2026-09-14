import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.11 No-Mock Verification)', () => {
  it('should verify ExecutiveGovernanceDebugBadge file is completely removed', () => {
    const badgePath = path.resolve(process.cwd(), 'src/components/executive/ExecutiveGovernanceDebugBadge.tsx');
    expect(fs.existsSync(badgePath)).toBe(false);
  });
});
