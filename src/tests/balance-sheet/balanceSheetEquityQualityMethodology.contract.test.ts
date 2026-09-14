import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { TechnicalLayerBuilder } from '../../workspace/runtime/executive-consolidation/builders/TechnicalLayerBuilder';

describe('BalanceSheetEquityQualityMethodology', () => {
  it('Should apply ressalva metodológica when Capital Social is symbolic or < 5% of PL', () => {
    // We mock facts where capital < 5% of PL
    const facts = {
      patrimonioLiquido: 100000,
      lucrosPrejuizosAcumulados: 99000,
      capitalSocial: 1000 // 1% of PL
    };
    
    // Create an indicator simulating the builder's output which returns 'LIMITED_EVIDENCE'
    const ind = {
      metricName: 'Qualidade do Patrimônio Líquido',
      value: 'LIMITED_EVIDENCE',
      classification: 'Muito Sólida', // mock original classification
      healthStatus: 'HEALTHY'
    };

    const families = TechnicalLayerBuilder.build([ind], (k: string) => k, undefined, facts as any, 'NORMAL');
    
    // Find the Qualidade do PL indicator
    let found = false;
    for (const family of families) {
      for (const m of family.indicators) {
        if (m.label === 'Qualidade do Patrimônio Líquido') {
          found = true;
          // 1. Should not classify as Muito Sólida
          assert.notStrictEqual(m.classificationLabel, 'Muito Sólida');
          assert.strictEqual(m.classificationLabel, 'Sólida com Ressalva');
          
          // 2. Should have the exact methodological note
          assert.strictEqual(m.methodologicalNotes, 'Patrimônio líquido predominantemente formado por lucros acumulados; evidência positiva de retenção de resultados, com ressalva metodológica por capital social simbólico.');
        }
      }
    }
    
    assert.ok(found, 'Should have found the Qualidade do Patrimônio Líquido indicator');
  });
});
