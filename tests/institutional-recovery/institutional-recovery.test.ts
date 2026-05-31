import { test, describe } from 'node:test';
import assert from 'node:assert';
import { InstitutionalRecoveryEngine } from '../../src/core/runtime/institutional-recovery/InstitutionalRecoveryEngine';
import { RecoveryEvaluationInput } from '../../src/core/runtime/institutional-recovery/RecoveryTypes';

describe('IRRE - Institutional Recovery & Reauthorization Engine', () => {

  const baseLineage = {
    fiduciaryOutput: { lineageHash: 'FID_123', patrimonialIntegrityStatus: 'PRESERVED' },
    treasuryRuntime: { treasuryLineageHash: 'TRE_123' },
    cashIntelligenceRuntime: { lineageHash: 'CASH_123', continuityRisk: { projectedRunwayMonths: 12 } }
  };

  test('1. Um único ano positivo NÃO autoriza recuperação (RECOVERY_MONITORING)', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      fco: 1000,
      netIncome: 1000,
      historicalCycles: [] // 0 past cycles + 1 current = 1 cycle
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, false);
    assert.strictEqual(result.activeRecoveryStage, 'RECOVERY_MONITORING');
    assert.strictEqual(result.longitudinalValidationStatus, 'PARTIAL_VALIDATION');
  });

  test('2. Geração de caixa operacional persistente (3 ciclos) é exigida (RECOVERY_STAGE_1)', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      fco: 1000,
      netIncome: 1000,
      historicalCycles: [{ fco: 500 }, { fco: 200 }] // 2 past + 1 current = 3
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, true);
    assert.strictEqual(result.activeRecoveryStage, 'RECOVERY_STAGE_1');
    assert.strictEqual(result.longitudinalValidationStatus, 'LONGITUDINAL_VALIDATION_COMPLETE');
  });

  test('3. Instabilidade de tesouraria bloqueia recuperação plena (RECOVERY_STAGE_1_PENDING)', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      cashIntelligenceRuntime: { lineageHash: 'CASH', continuityRisk: { projectedRunwayMonths: 2 } }, // runway critical
      fco: 1000,
      netIncome: 1000,
      historicalCycles: [{ fco: 500 }, { fco: 200 }] // 3 positive cycles but fragile treasury
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, false);
    assert.strictEqual(result.activeRecoveryStage, 'RECOVERY_STAGE_1_PENDING');
  });

  test('4. Erosão patrimonial restringe recuperação plena', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      fiduciaryOutput: { lineageHash: 'FID', patrimonialIntegrityStatus: 'ERODED' },
      fco: 1000,
      netIncome: 1000,
      historicalCycles: [{ fco: 500 }, { fco: 200 }, { fco: 100 }, { fco: 100 }, { fco: 100 }, { fco: 100 }] // >6 cycles
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, false); // False recovery because PL is eroded
    assert.strictEqual(result.falseRecoveryDetected, true);
  });

  test('5. Detecção de falsa recuperação bloqueia crescimento', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      fco: -500, // Negative FCO
      netIncome: 1000, // Positive Net Income (isolate profit)
      historicalCycles: [{ fco: 500 }, { fco: 200 }, { fco: 100 }]
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, false);
    assert.strictEqual(result.falseRecoveryDetected, true);
    assert.ok(result.falseRecoveryDrivers.includes('LUCRO_SEM_CONVERSAO_DE_CAIXA_OPERACIONAL'));
  });

  test('6. Estágios de recuperação liberam restrições progressivamente', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      fco: 1000,
      historicalCycles: [{ fco: 1000 }, { fco: 1000 }, { fco: 1000 }] // 4 cycles -> STAGE_2
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.activeRecoveryStage, 'RECOVERY_STAGE_2');
    assert.ok(result.releasedConstraints.includes('CAPEX_LOCK'));
    assert.ok(!result.releasedConstraints.includes('DIVIDEND_LOCK')); // Not yet released
  });

  test('7. ISHE fail closed triggers se lineage missing', () => {
    const input: RecoveryEvaluationInput = {
      fco: 1000, historicalCycles: []
    } as any;
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, false);
    assert.strictEqual(result.lineageHash, 'IRRE_FAIL_CLOSED');
  });

  test('10. Reautorização completa exige validação longitudinal (6 ciclos + PL Preservado + Treasury Resilient)', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      fco: 1000,
      netIncome: 1000,
      historicalCycles: [
        { fco: 1000 }, { fco: 1000 }, { fco: 1000 }, { fco: 1000 }, { fco: 1000 }
      ] // 6 cycles
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, true);
    assert.strictEqual(result.activeRecoveryStage, 'FULL_REAUTHORIZATION');
    assert.strictEqual(result.remainingConstraints.length, 0); // all unlocked
  });

  test('11. Falsa Recuperação: Caixa Artificial (Aporte sem FCO)', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      fco: -100,
      availableCash: 50000,
      memoryProfile: { cashInjections: true }
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, false);
    assert.strictEqual(result.falseRecoveryDetected, true);
    assert.ok(result.falseRecoveryDrivers.includes('CAIXA_ARTIFICIAL_POR_APORTE_OU_DIVIDA_SEM_FCO'));
  });

  test('12. Falsa Recuperação: Retenção forçada recente', () => {
    const input: RecoveryEvaluationInput = {
      ...baseLineage,
      fiduciaryOutput: { lineageHash: 'FID_1', retentionClassification: 'FORCED_RETENTION', patrimonialIntegrityStatus: 'PRESERVED' },
      fco: -100 // FCO negative but history shows forced retention
    };
    const result = InstitutionalRecoveryEngine.evaluate(input);
    assert.strictEqual(result.recoveryAuthorized, false);
    assert.strictEqual(result.falseRecoveryDetected, true);
    assert.ok(result.falseRecoveryDrivers.includes('RETENCAO_FORCADA_RECENTE_SEM_VIRADA_OPERACIONAL'));
  });

});
