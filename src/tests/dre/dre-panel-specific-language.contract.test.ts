import test from 'node:test';
import assert from 'node:assert';
import { getCausalFragment } from '../../capabilities/financial/runtime/dre/DreSemanticRegistry';

test('[DRE] Semantics: Panel Specific Language', () => {
  const p1Frag = getCausalFragment('VALUE_CREATION', 'UNSUSTAINABLE');
  const p3Frag = getCausalFragment('SURVIVAL_THRESHOLD', 'UNSUSTAINABLE');

  // As mensagens não devem ser genéricas ou com template swap. 
  // O core causal e implicações devem ser completamente distintos por painel.
  assert.ok(p1Frag.causalCore !== p3Frag.causalCore, 'P1 e P3 devem ter Causal Cores diferentes');
  assert.ok(p1Frag.executiveImplication !== p3Frag.executiveImplication, 'P1 e P3 devem ter Executive Implications diferentes');
  assert.ok(p1Frag.boardMandate !== p3Frag.boardMandate, 'P1 e P3 devem ter Board Mandates diferentes');
  
  // Nenhuma das frases do P1 deve conter as de P3
  assert.ok(!p1Frag.causalCore.includes(p3Frag.causalCore), 'Textos devem ser independentes');
});
