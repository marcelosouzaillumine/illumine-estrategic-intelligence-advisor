import test from 'node:test';
import assert from 'node:assert';
import { DreExecutiveLanguageCompiler } from '../../core/runtime/dre/DreExecutiveLanguageCompiler';
import { getCausalFragment, PanelIntent } from '../../core/runtime/dre/DreSemanticRegistry';

test('DRE Panel Language Diversity Contract', async (t) => {
  await t.test('Panels should not repeat boilerplate interpretations', () => {
    const compiler = new DreExecutiveLanguageCompiler();

    const intents: PanelIntent[] = [
      'VALUE_CREATION',
      'STRUCTURE_SUSTAINABILITY',
      'SURVIVAL_THRESHOLD',
      'GROWTH_CONSTRAINT',
      'SCALE_EFFICIENCY',
      'INACTION_RISK',
      'BOARD_MANDATE'
    ];

    const interpretations = new Set<string>();

    for (const intent of intents) {
      const frag = getCausalFragment(intent, 'ADEQUATE');
      const compiled = compiler.compilePanelResponse(intent, frag, 'ADEQUATE');
      
      // Get the first part of the response (the interpretation prefix)
      // e.g. "A formação de resultado da companhia indica..."
      const prefix = compiled.response.split(' ')[0] + ' ' + compiled.response.split(' ')[1];
      
      interpretations.add(prefix);
      
      // Assure the legacy boilerplate is dead
      assert.ok(!compiled.response.includes('Com margem líquida de'));
      assert.ok(!compiled.response.includes('a operação evidencia que'));
      assert.ok(!compiled.response.includes('A diretriz estratégica é'));
    }

    // All intents must have a different starting prefix
    assert.strictEqual(interpretations.size, intents.length, 'There are duplicated sentence structures across panel intents');
  });
});
