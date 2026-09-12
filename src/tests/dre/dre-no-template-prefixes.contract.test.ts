import test from 'node:test';
import assert from 'node:assert';
import { DreExecutiveLanguageCompiler } from '../../capabilities/financial/runtime/dre/DreExecutiveLanguageCompiler';
import { getCausalFragment } from '../../capabilities/financial/runtime/dre/DreSemanticRegistry';

test('[DRE] Semantics: No Template Prefixes', () => {
  const compiler = new DreExecutiveLanguageCompiler();
  const frag = getCausalFragment('VALUE_CREATION', 'UNSUSTAINABLE');
  const compiled = compiler.compilePanelResponse('VALUE_CREATION', frag, 'UNSUSTAINABLE');

  const forbiddenTemplates = [
    "Alta robustez:",
    "Patamar crítico:",
    "A recomendação tática é",
    "chancelando resiliência",
    "Operação limítrofe:"
  ];

  forbiddenTemplates.forEach(template => {
    assert.ok(!compiled.response.includes(template), `A resposta não deve conter o template: "${template}"`);
    assert.ok(!compiled.rationale.includes(template), `O rationale não deve conter o template: "${template}"`);
    assert.ok(!compiled.recommendation.includes(template), `A recomendação não deve conter o template: "${template}"`);
  });
});
