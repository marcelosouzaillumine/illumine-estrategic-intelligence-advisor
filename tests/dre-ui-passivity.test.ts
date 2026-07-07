import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';

describe('DRE UI Passivity', () => {
  it('DREPage.tsx should not contain local health score calculation or semantic translation fallbacks', () => {
    const drePagePath = path.join(process.cwd(), 'src/components/pages/DREPage.tsx');
    if (fs.existsSync(drePagePath)) {
      const content = fs.readFileSync(drePagePath, 'utf8');

      assert.ok(!content.includes('Crescimento Destrutivo: Aumento de volume de vendas associado'));
      assert.ok(!content.includes('Estresse de Liquidez Operacional:'));
      assert.ok(!/healthIndex\s*=\s*(Math|0|100)/.test(content));
    }
  });

  it('DREBoardDecisionSupportSection.tsx should not contain fallback logic', () => {
    const sectionPath = path.join(process.cwd(), 'src/components/pages/dre/DREBoardDecisionSupportSection.tsx');
    if (fs.existsSync(sectionPath)) {
      const content = fs.readFileSync(sectionPath, 'utf8');

      // UI should purely read from the viewModel, no inline string decisions.
      assert.ok(!content.includes('Aguardando dados'));
      assert.ok(!/viewModel\.p1ValueCreation \?\?/.test(content));
    }
  });
});
