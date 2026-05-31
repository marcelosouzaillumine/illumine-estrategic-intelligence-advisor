// tests/recovery-regression/recovery-regression.test.ts

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RecoveryRegressionGuardEngine } from '../../src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine';
import { RegressionEvaluationInput } from '../../src/core/runtime/recovery-regression/RecoveryRegressionTypes';

describe('RecoveryRegressionGuardEngine Validation', () => {
  it('Scenario 1: Should pass FULLY_STABLE without regression', () => {
    const input: RegressionEvaluationInput = {
      recoveryReport: { activeRecoveryStage: 'FULL_REAUTHORIZATION' },
      fco: 150000,
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 14 } },
      treasuryRuntime: { severity: 'STABLE' },
      fiduciaryOutput: { patrimonialIntegrityStatus: 'PRESERVED', retentionClassification: 'STRATEGIC_RETENTION' }
    };
    
    const result = RecoveryRegressionGuardEngine.evaluate(input);
    assert.strictEqual(result.regressionDetected, false);
    assert.strictEqual(result.currentRecoveryStage, 'FULL_REAUTHORIZATION');
    assert.ok(result.recoveryStabilityScore >= 90);
  });

  it('Scenario 2: Should detect relapse when FCO drops below zero and downgrade', () => {
    const input: RegressionEvaluationInput = {
      recoveryReport: { activeRecoveryStage: 'RECOVERY_STAGE_3' },
      fco: -50000,
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 8 } },
      treasuryRuntime: { severity: 'STABLE' },
      fiduciaryOutput: { patrimonialIntegrityStatus: 'PRESERVED' }
    };
    
    const result = RecoveryRegressionGuardEngine.evaluate(input);
    assert.strictEqual(result.relapseDetected, true);
    assert.strictEqual(result.regressionDetected, true);
    assert.ok(result.relapseDrivers.includes('RETORNO_FCO_NEGATIVO'));
    assert.strictEqual(result.currentRecoveryStage, 'SURVIVAL_MODE');
    assert.ok(result.reactivatedConstraints.includes('CAPEX_LOCK'));
  });

  it('Scenario 3: Should downgrade to RECOVERY_STAGE_1 when stability is STABLE_WITH_MONITORING but FCO is zero', () => {
    const input: RegressionEvaluationInput = {
      recoveryReport: { activeRecoveryStage: 'FULL_REAUTHORIZATION' },
      fco: 0,
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 5 } },
      treasuryRuntime: { severity: 'PRESSURED' },
      fiduciaryOutput: { patrimonialIntegrityStatus: 'PRESSURED' }
    };
    
    const result = RecoveryRegressionGuardEngine.evaluate(input);
    assert.ok(result.recoveryStabilityScore < 70);
    assert.strictEqual(result.regressionDetected, true);
    assert.notStrictEqual(result.currentRecoveryStage, 'FULL_REAUTHORIZATION');
  });

  it('Scenario 4: Should fail closed if no recoveryReport is provided', () => {
    const input: RegressionEvaluationInput = {
      fco: 10000
    };
    
    const result = RecoveryRegressionGuardEngine.evaluate(input);
    assert.strictEqual(result.failClosedTriggered, true);
    assert.strictEqual(result.regressionDetected, true);
    assert.strictEqual(result.currentRecoveryStage, 'SURVIVAL_MODE');
  });

  it('Scenario 5: Should not regress if already in SURVIVAL_MODE', () => {
    const input: RegressionEvaluationInput = {
      recoveryReport: { activeRecoveryStage: 'SURVIVAL_MODE' },
      fco: -10000,
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 1 } },
      treasuryRuntime: { severity: 'CRITICAL' },
      fiduciaryOutput: { patrimonialIntegrityStatus: 'SEVERELY_ERODED' }
    };
    
    const result = RecoveryRegressionGuardEngine.evaluate(input);
    assert.strictEqual(result.regressionDetected, false); // Because it can't regress further than survival
    assert.strictEqual(result.currentRecoveryStage, 'SURVIVAL_MODE');
  });
});
