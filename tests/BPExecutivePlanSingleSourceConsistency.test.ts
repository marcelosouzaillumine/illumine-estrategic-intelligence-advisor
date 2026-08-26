import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('BPExecutivePlanSingleSourceConsistency', () => {
  it('should not contain Parecer Estratégico in UI files', () => {
    const filesToCheck = [
      'src/components/ui/executive-strategic-semantic-cards.tsx',
      'src/components/pages/balance-sheet/BalanceSheetBoardAdvisory.tsx',
      'src/components/ExecutiveCommentary.tsx',
      'src/components/pages/BalanceSheetPage.tsx',
      'src/components/pages/balance-sheet/BalanceSheetExecutiveSynthesisSection.tsx'
    ];

    for (const file of filesToCheck) {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        assert.ok(!content.includes('Parecer Estratégico'), `File ${file} still contains 'Parecer Estratégico'`);
        assert.ok(!content.includes('parecer estratégico'), `File ${file} still contains 'parecer estratégico'`);
      }
    }
  });

  it('BalanceSheetExecutivePlan component has no legacy fallbacks', () => {
    const fullPath = path.resolve(process.cwd(), 'src/components/pages/balance-sheet/BalanceSheetExecutivePlan.tsx');
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(!content.includes("'Dados Insuficientes'"), "Should not contain fallback 'Dados Insuficientes'");
      assert.ok(!content.includes("'Desempenho Geral'"), "Should not contain fallback 'Desempenho Geral'");
      assert.ok(!content.includes("'Otimização Estratégica'"), "Should not contain fallback 'Otimização Estratégica'");
    }
  });

  it('BalanceSheetPage uses single source context', () => {
    const fullPath = path.resolve(process.cwd(), 'src/components/pages/BalanceSheetPage.tsx');
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(content.includes('ExecutiveProductRenderer'), "Should use ExecutiveProductRenderer");
      assert.ok(content.includes('product={FinancialPositionProduct}'), "Should render FinancialPositionProduct");
      assert.ok(content.includes('context={experienceContext}'), "Renderer should receive context");
    }
  });
});
