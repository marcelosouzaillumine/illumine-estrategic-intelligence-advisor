import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CashConcentrationAssessmentEngine } from '../src/capabilities/runtime/governance/bp/CashConcentrationAssessmentEngine';

describe('CashConcentration Golden Test', () => {
  it('should label 43.6% cash as Reserva financeira elevada', () => {
    const summary = {
      ativoTotal: 100000,
      caixaEquivalentes: 43600
    };
    
    const result = CashConcentrationAssessmentEngine.assess(summary as any);
    
    assert.strictEqual(result?.classification, 'Reserva financeira elevada');
    assert.ok(Math.abs(result!.ratio - 0.436) < 0.001);
  });
});
