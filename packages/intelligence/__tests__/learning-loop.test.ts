import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 16 Phase 8 Learning Loop Activation)', () => {
  it('should verify WAVE16_CONTROLLED_AUTONOMOUS_ADVISORY_REPORT.md has GO verdict', () => {
    const docPath = path.resolve(process.cwd(), 'WAVE16_CONTROLLED_AUTONOMOUS_ADVISORY_REPORT.md');
    const content = fs.readFileSync(docPath, 'utf-8');

    expect(content).toContain('GO (APROVADO PARA OPERAÇÃO DE INTELIGÊNCIA CONTINUA GOVERNADA)');
    expect(content).toContain('96.5 / 100');
  });
});
