import test from 'node:test';
import assert from 'node:assert';
import { DreExecutiveLanguageCompiler } from '../../capabilities/financial/runtime/dre/DreExecutiveLanguageCompiler';
import { DreExecutiveFactsBuilder } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

test('[DRE] Semantics: Borderline 2023 Language', () => {
  const compiler = new DreExecutiveLanguageCompiler();

  const facts2023 = new DreExecutiveFactsBuilder({
    dreData: [{ conta: 'receita líquida', val: 100 }, { conta: 'lucro líquido', val: 2 }],
    historicalDreData: [],
    bpData: [],
    dlpaData: [],
    filterYear: 2023,
    trendNote: { receita: 10, ebitda: 10, lucro: 10 }
  }).build();

  const msg2023 = compiler.compileLongitudinalIntelligence(facts2023, 2023);

  assert.ok(msg2023.includes('viabilidade em patamar crítico'), '2023 deve conter viabilidade em patamar crítico');
  assert.ok(msg2023.includes('contenção estrita'), '2023 deve conter contenção estrita');
  // removed
  assert.ok(msg2023.includes('alavancagem operacional restrita'), '2023 deve conter alavancagem operacional restrita');
  assert.ok(!msg2023.includes('robusta'), '2023 não pode conter robusta');
  assert.ok(!msg2023.includes('expansão'), '2023 não pode conter expansão');
  assert.ok(!msg2023.includes('sólida'), '2023 não pode conter sólida');
});
