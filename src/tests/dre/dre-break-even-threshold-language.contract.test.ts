import test from 'node:test';
import assert from 'node:assert';
import { DreNarrativeSeverity } from '../../core/runtime/dre/DreNarrativeSeverity';
import { getCausalFragment } from '../../core/runtime/dre/DreSemanticRegistry';

test('DRE Break-Even Threshold Language Contract', async (t) => {
  await t.test('Coverage < 100% (CRITICAL) must not use folga and must indicate insufficiency', () => {
    const severity = DreNarrativeSeverity.forBreakEvenCoverage(0.99);
    assert.strictEqual(severity, 'UNSUSTAINABLE');
    
    const frag = getCausalFragment('SURVIVAL_THRESHOLD', severity);
    const text = frag.causalCore.toLowerCase() + ' ' + frag.recommendedAction.toLowerCase();
    
    assert.ok(!text.includes('folga'), 'Should not use folga');
    assert.ok(text.includes('incapacidade contínua'), 'Must mention incapacidade contínua');
  });

  await t.test('Coverage between 100% and 110% (BORDERLINE) must use estreito', () => {
    const severity = DreNarrativeSeverity.forBreakEvenCoverage(1.05);
    assert.strictEqual(severity, 'BORDERLINE');
    
    const frag = getCausalFragment('SURVIVAL_THRESHOLD', severity);
    const text = frag.causalCore.toLowerCase();
    
    assert.ok(text.includes('distanciamento limite'), 'Must use distanciamento limite');
  });

  await t.test('Coverage > 150% (STRONG) must use margem de segurança', () => {
    const severity = DreNarrativeSeverity.forBreakEvenCoverage(1.6);
    assert.strictEqual(severity, 'STRONG');
    
    const frag = getCausalFragment('SURVIVAL_THRESHOLD', severity);
    const text = frag.causalCore.toLowerCase();
    
    assert.ok(text.includes('ampla cobertura'), 'Must mention ampla cobertura');
  });
});
