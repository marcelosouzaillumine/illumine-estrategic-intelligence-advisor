import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BalanceSheetExecutiveNarrativeEngine } from '../src/core/runtime/governance/bp/BalanceSheetExecutiveNarrativeEngine';
import { BalanceSheetNarrativeTemporalAudit } from '../src/core/runtime/governance/bp/BalanceSheetNarrativeTemporalAudit';
import { BalanceSheetHistoricalContaminationAudit } from '../src/core/runtime/governance/bp/BalanceSheetHistoricalContaminationAudit';
import { BalanceSheetExerciseBindingGuard } from '../src/core/runtime/governance/bp/BalanceSheetExerciseBindingGuard';

describe('Granatum 2023 Temporal Integrity Golden Test', () => {
  const granatum2023Summary = {
    exerciseYear: 2023,
    patrimonioLiquido: 207999.77,
    ativoTotal: 1000000,
    caixaEquivalentes: 50000,
    passivoCirculante: 40000
  };

  const granatum2023Indicators = [
    { metricName: 'Liquidez Real', value: 9.05 },
    { metricName: 'Liquidez Instantânea Real', value: 6.29 },
    { metricName: 'Capital Consumido', value: 0.225, evidence: { capitalConsumedAmount: 22500 } }
  ];

  it('should pass temporal integrity with matching narrative and indicators', () => {
    // Generate Narrative
    const { text, narrativeMetadata } = BalanceSheetExecutiveNarrativeEngine.generate(
      granatum2023Indicators,
      granatum2023Summary,
      2023,
      'hash_mock'
    );

    // Ensure generated narrative contains the expected strings
    assert.ok(text.includes('207.999,77'));
    assert.ok(text.includes('9,05'));
    assert.ok(text.includes('6,29'));
    assert.ok(text.includes('22,5%'));

    // Ensure it DOES NOT contain Granatum 2022 strings
    assert.ok(!text.includes('59.620,26'));
    assert.ok(!text.includes('0,32'));
    assert.ok(!text.includes('0,17'));
    assert.ok(!text.includes('50,8%'));

    // Audit the narrative
    const auditResult = BalanceSheetNarrativeTemporalAudit.audit(text, granatum2023Summary, granatum2023Indicators);
    
    assert.strictEqual(auditResult.isDriftDetected, false, 'No drift should be detected for valid narrative');
    assert.strictEqual(auditResult.violations.length, 0);
  });

  it('should detect HISTORICAL_CONTAMINATION if payload contains old year', () => {
    const rawData = {
      year: 2023,
      bpSummary: { exerciseYear: 2022 }
    };
    const auditResult = BalanceSheetHistoricalContaminationAudit.audit(2023, rawData);
    assert.strictEqual(auditResult.isContaminated, true);
    assert.ok(auditResult.violations[0].includes('HISTORICAL_CONTAMINATION_DETECTED'));
  });

  it('should throw EXERCISE_BINDING_VIOLATION if summary year does not match requested year', () => {
    const bindingGuard = BalanceSheetExerciseBindingGuard.validate(2023, 2022);
    assert.strictEqual(bindingGuard.isValid, false);
    assert.strictEqual(bindingGuard.violation, 'EXERCISE_BINDING_VIOLATION');
  });

  it('should NOT throw EXERCISE_BINDING_VIOLATION if summary year is missing (will be attached by runtime)', () => {
    const bindingGuard = BalanceSheetExerciseBindingGuard.validate(2023, undefined);
    assert.strictEqual(bindingGuard.isValid, true);
  });

  it('should detect SEMANTIC_DRIFT_DETECTED if narrative drifts beyond executive tolerance', () => {
    const fakeContaminatedNarrative = 'A companhia encerrou o exercício com patrimônio líquido positivo de R$ 59.620,26, representando 5.9% do ativo total... A liquidez permanece forte, com Liquidez Real de 0,32 e Liquidez Instantânea Real de 0,17. prejuízos acumulados de R$ 50.800, estes representam 50,8% do capital social';
    
    const auditResult = BalanceSheetNarrativeTemporalAudit.audit(fakeContaminatedNarrative, granatum2023Summary, granatum2023Indicators);
    
    assert.strictEqual(auditResult.isDriftDetected, true);
    assert.ok(auditResult.violations.some(v => v.includes('Patrimônio Líquido')));
    assert.ok(auditResult.violations.some(v => v.includes('Liquidez Real')));
    assert.ok(auditResult.violations.some(v => v.includes('Liquidez Instantânea Real')));
    assert.ok(auditResult.violations.some(v => v.includes('Capital Consumido')));
  });
});
