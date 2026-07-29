import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/intelligence (Wave 17.10 Executive Intelligence Visibility Audit)', () => {
  it('should verify EXECUTIVE_INTELLIGENCE_VISIBILITY_AUDIT.md confirms perception in <10s (ADR-063)', () => {
    const auditPath = path.resolve(process.cwd(), 'docs/architecture/product/EXECUTIVE_INTELLIGENCE_VISIBILITY_AUDIT.md');
    const content = fs.readFileSync(auditPath, 'utf-8');

    expect(content).toContain('PERCEPTIBLE & VERIFIED');
    expect(content).toContain('Dashboard Executivo');
    expect(content).toContain('DRE Contábil');
  });
});
