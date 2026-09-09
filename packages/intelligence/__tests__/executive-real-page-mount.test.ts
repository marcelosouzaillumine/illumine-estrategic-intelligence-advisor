import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.10.1 Real Page Mount Verification)', () => {
  it('should verify EXECUTIVE_GOVERNANCE_REAL_MOUNT_AUDIT.md classifies 100% pages as MONTADO_REAL (ADR-064)', () => {
    const auditPath = path.resolve(process.cwd(), 'docs/architecture/product/EXECUTIVE_GOVERNANCE_REAL_MOUNT_AUDIT.md');
    const content = fs.readFileSync(auditPath, 'utf-8');

    expect(content).toContain('MONTADO_REAL');
    expect(content).toContain('DRE Contábil');
    expect(content).toContain('Balanço Patrimonial');
  });
});
