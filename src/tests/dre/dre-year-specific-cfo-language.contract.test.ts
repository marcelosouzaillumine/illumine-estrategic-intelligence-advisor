import test from 'node:test';
import assert from 'node:assert';
import { DreExecutiveLanguageCompiler } from '../../capabilities/financial/runtime/dre/DreExecutiveLanguageCompiler';
import { DreExecutiveFactsBuilder } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

test('[DRE] Semantics: Year Specific CFO Language', () => {
  const compiler = new DreExecutiveLanguageCompiler();

  const facts2022 = new DreExecutiveFactsBuilder({
    dreData: [{ conta: 'receita líquida', val: 100 }, { conta: 'lucro líquido', val: -10 }],
    historicalDreData: [],
    bpData: [],
    dlpaData: [],
    filterYear: 2022,
    trendNote: { receita: 10, ebitda: 10, lucro: 10 }
  }).build();

  const facts2024 = new DreExecutiveFactsBuilder({
    dreData: [{ conta: 'receita líquida', val: 200 }, { conta: 'lucro líquido', val: 50 }],
    historicalDreData: [],
    bpData: [],
    dlpaData: [],
    filterYear: 2024,
    trendNote: { receita: 10, ebitda: 10, lucro: 10 }
  }).build();

  const facts2025 = new DreExecutiveFactsBuilder({
    dreData: [{ conta: 'receita líquida', val: 250 }, { conta: 'lucro líquido', val: 45 }],
    historicalDreData: [],
    bpData: [],
    dlpaData: [],
    filterYear: 2025,
    trendNote: { receita: 10, ebitda: 10, lucro: 10 }
  }).build();

  const msg2022 = compiler.compileLongitudinalIntelligence(facts2022, 2022);
  const msg2024 = compiler.compileLongitudinalIntelligence(facts2024, 2024);
  const msg2025 = compiler.compileLongitudinalIntelligence(facts2025, 2025);

  assert.ok(msg2022.includes('necessidade aguda de turnaround'), 'Deve conter linguagem de estresse para 2022');
  assert.ok(msg2024.includes('salto consistente'), 'Deve conter salto consistente para 2024');
  assert.ok(msg2025.includes('manutenção de margem elevada'), 'Deve conter manutenção de margem para 2025');
  assert.ok(msg2025.includes('aumento das despesas fixas'), 'Deve conter atenção a despesas fixas para 2025');
});
