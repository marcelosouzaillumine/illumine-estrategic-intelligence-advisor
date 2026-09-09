import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 15D Operational Readiness)', () => {
  it('should verify WAVE15D_OPERATIONAL_READINESS_REPORT.md exists with GO verdict (Score 95.8 / 100)', () => {
    const reportPath = path.resolve(process.cwd(), 'WAVE15D_OPERATIONAL_READINESS_REPORT.md');
    const content = fs.readFileSync(reportPath, 'utf-8');

    expect(content).toContain('GO (APROVADO PARA WAVE 16');
    expect(content).toContain('95.8 / 100');
  });
});
