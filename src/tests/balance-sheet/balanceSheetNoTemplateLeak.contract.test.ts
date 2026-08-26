import { test, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

test('BalanceSheet Semantic Hygiene: No Template Leak & No DRE Terms', () => {
  const rawData = {
    patrimonialIntelligenceReport: {
      indicators: [
        { metricName: 'Liquidez Corrente', value: 0.5, familyName: 'Liquidez', classification: 'Crítico' },
        { metricName: 'Autonomia Financeira', value: 0.1, familyName: 'Estrutura', classification: 'Crítico' },
        { metricName: 'Capital de Giro Líquido', value: -1000, familyName: 'Giro', classification: 'Crítico' }
      ]
    }
  };

  const vm = BalanceSheetExecutiveViewModelBuilder.build(rawData);

  const allText = JSON.stringify(vm).toLowerCase();

  const dreTerms = ['ebitda', 'margem de contribuição', 'margem líquida', 'ponto de equilíbrio', 'resultado operacional'];
  
  for (const term of dreTerms) {
    assert.ok(!allText.includes(term), `Vazamento semântico detectado: termo da DRE "${term}" encontrado no Balance Sheet.`);
  }
});
