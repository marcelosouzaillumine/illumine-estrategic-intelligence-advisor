import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/executive-simulation-engine (Wave 15C Scenario Validation)', () => {
  it('should verify the 8 canonical simulation scenarios documented in SCENARIO_LIBRARY.md', () => {
    const docPath = path.resolve(process.cwd(), 'docs/architecture/simulation/SCENARIO_LIBRARY.md');
    const content = fs.readFileSync(docPath, 'utf-8');

    expect(content).toContain('Cenário 1: Crise de Liquidez');
    expect(content).toContain('Cenário 2: Queda de Margem');
    expect(content).toContain('Cenário 3: Expansão Comercial');
    expect(content).toContain('Cenário 4: Aquisição M&A');
    expect(content).toContain('Cenário 5: Turnover Crítico');
    expect(content).toContain('Cenário 6: Não Conformidade');
    expect(content).toContain('Cenário 7: Inovação & Produto');
    expect(content).toContain('Cenário 8: Decisão Complexa');
  });
});
