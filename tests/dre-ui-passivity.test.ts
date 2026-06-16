import * as fs from 'fs';
import * as path from 'path';

describe('DRE UI Passivity', () => {
  it('DREPage.tsx should not contain local health score calculation or semantic translation fallbacks', () => {
    const drePagePath = path.join(__dirname, '../src/components/pages/DREPage.tsx');
    const content = fs.readFileSync(drePagePath, 'utf8');

    expect(content).not.toContain('Crescimento Destrutivo: Aumento de volume de vendas associado');
    expect(content).not.toContain('Estresse de Liquidez Operacional:');
    expect(content).not.toMatch(/healthIndex\s*=\s*(Math|0|100)/);
  });

  it('DREBoardDecisionSupportSection.tsx should not contain fallback logic', () => {
    const sectionPath = path.join(__dirname, '../src/components/pages/dre/DREBoardDecisionSupportSection.tsx');
    const content = fs.readFileSync(sectionPath, 'utf8');

    // UI should purely read from the viewModel, no inline string decisions.
    expect(content).not.toContain('Aguardando dados');
    expect(content).not.toMatch(/viewModel\.p1ValueCreation \?\?/);
  });
});
