import test from 'node:test';
import assert from 'node:assert';
import { DreExecutiveLanguageCompiler } from '../../core/runtime/dre/DreExecutiveLanguageCompiler';
import { PanelIntent, CausalDriverFragment } from '../../core/runtime/dre/DreSemanticRegistry';
import { NarrativeSeverity } from '../../core/runtime/dre/DreNarrativeSeverity';

test('DRE Threshold Language Calibration Contract', async (t) => {

  await t.test('Threshold language logic is properly calibrated by severity and without templates', () => {
    const compiler = new DreExecutiveLanguageCompiler();

    const getFrag = (intent: PanelIntent): CausalDriverFragment => ({
      intent,
      severity: 'ADEQUATE',
      causalCore: 'driver teste',
      executiveImplication: 'implicacao teste',
      boardMandate: 'mandato teste',
      recommendedAction: 'recomendacao teste'
    });

    const frag = getFrag('VALUE_CREATION');

    // Assegura que o rationale combina as partes semanticamente ricas, sem templates pré-fixados
    const compiledCritical = compiler.compilePanelResponse('VALUE_CREATION', frag, 'UNSUSTAINABLE');
    assert.ok(compiledCritical.rationale.includes('Driver teste. mandato teste.'), 'Rationale should be constructed from causalCore and boardMandate');
    assert.ok(compiledCritical.response === 'implicacao teste', 'Response should be executiveImplication');
    assert.ok(compiledCritical.recommendation === 'recomendacao teste', 'Recommendation should be recommendedAction');
    
    // Assegura que não há "Patamar crítico:" ou "Alta robustez:" injetados
    assert.ok(!compiledCritical.rationale.includes('Patamar crítico:'));
    assert.ok(!compiledCritical.rationale.includes('Alta robustez:'));
  });
});
