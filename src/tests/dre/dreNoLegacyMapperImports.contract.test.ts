import fs from 'fs';
import path from 'path';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('DRE Canonical Harmonization - No Legacy Imports', () => {
  const drePagePath = path.resolve(process.cwd(), 'src/components/pages/DREPage.tsx');
  const drePageContent = fs.readFileSync(drePagePath, 'utf8');

  it('DREPage.tsx não deve importar mappers legados de UI', () => {
    assert.strictEqual(/import.*from.*mappers/.test(drePageContent), false, 'Importação de mappers encontrada');
  });

  it('DREPage.tsx não deve acessar dreInsights', () => {
    assert.strictEqual(/dreInsights/.test(drePageContent), false, 'Acesso a dreInsights encontrado');
  });

  it('DREPage.tsx não deve acessar financialMetrics desestruturado', () => {
    assert.strictEqual(/financialMetrics.*receitaBruta/.test(drePageContent), false, 'Acesso desestruturado a financialMetrics encontrado');
  });

  it('DREPage.tsx não deve recalcular dados com cascadeResult diretamente', () => {
    const cascadeResultUsage = drePageContent.split('\n').filter(line => line.includes('cascadeResult'));
    cascadeResultUsage.forEach(line => {
      assert.strictEqual(/cascadeResult\.find/.test(line), false, 'Encontrado uso proibido: cascadeResult.find');
      assert.strictEqual(/cascadeResult\.filter/.test(line), false, 'Encontrado uso proibido: cascadeResult.filter');
      assert.strictEqual(/cascadeResult\.map/.test(line), false, 'Encontrado uso proibido: cascadeResult.map');
    });
  });
});
