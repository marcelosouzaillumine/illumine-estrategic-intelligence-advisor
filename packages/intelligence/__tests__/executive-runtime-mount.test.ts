import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17.8 Phase 1 Runtime Mount Audit)', () => {
  it('should verify PAGE_GOVERNANCE_RUNTIME_AUDIT.md confirms 100% page coverage (ADR-061)', () => {
    const auditPath = path.resolve(process.cwd(), 'docs/architecture/product/PAGE_GOVERNANCE_RUNTIME_AUDIT.md');
    const content = fs.readFileSync(auditPath, 'utf-8');

    expect(content).toContain('MOUNTED & CERTIFIED');
    expect(content).toContain('DRE Contábil');
    expect(content).toContain('Balanço Patrimonial');
    expect(content).toContain('DFC (Fluxo de Caixa)');
  });
});
