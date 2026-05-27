import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CalibrationEngine } from '../src/core/runtime/calibration/CalibrationEngine';
import { BALANCED_PROFILE, CONSERVATIVE_PROFILE } from '../src/core/runtime/calibration/CalibrationProfiles';

describe('Phase 9: Calibration Regression Tests', () => {
  beforeEach(() => {
    CalibrationEngine.resetToDefault();
  });

  it('1. Deve iniciar com o perfil balanced por padrão', () => {
    const params = CalibrationEngine.getCalibration();
    assert.strictEqual(CalibrationEngine.getActiveProfileId(), 'balanced');
    assert.strictEqual(CalibrationEngine.getVersion(), 'v1.0.0');
    assert.strictEqual(params.confidenceCollapseThreshold, BALANCED_PROFILE.confidenceCollapseThreshold);
    assert.strictEqual(params.confidenceDegradedThreshold, BALANCED_PROFILE.confidenceDegradedThreshold);
  });

  it('2. Deve aplicar novo perfil validando regras fiduciárias e gerando audit trail', () => {
    const audit = CalibrationEngine.applyProfile(
      'conservative',
      'usr_123',
      'Justificativa fiduciária com tamanho adequado para alteração.'
    );

    assert.strictEqual(CalibrationEngine.getActiveProfileId(), 'conservative');
    assert.strictEqual(CalibrationEngine.getVersion(), 'v1.0.1');
    assert.strictEqual(audit.profileId, 'conservative');
    assert.strictEqual(audit.actorId, 'usr_123');
    assert.strictEqual(audit.rationale, 'Justificativa fiduciária com tamanho adequado para alteração.');
    assert.strictEqual(audit.previousVersion, 'v1.0.0');
    assert.ok(audit.diff.length > 0);

    const params = CalibrationEngine.getCalibration();
    assert.strictEqual(params.confidenceCollapseThreshold, CONSERVATIVE_PROFILE.confidenceCollapseThreshold);
  });

  it('3. Deve rejeitar aplicação de perfil sem actorId ou justificativa curta', () => {
    assert.throws(() => {
      CalibrationEngine.applyProfile('conservative', '', 'Justificativa');
    }, /actorId é obrigatório/);

    assert.throws(() => {
      CalibrationEngine.applyProfile('conservative', 'usr_123', 'Curta');
    }, /justificativa fiduciária detalhada/);
  });

  it('4. Deve gerar diff correto ao atualizar parâmetro individual', () => {
    const audit = CalibrationEngine.updateParameter(
      'confidenceCollapseThreshold',
      0.50,
      'usr_456',
      'Ajustando threshold para testes sandbox'
    );

    assert.strictEqual(CalibrationEngine.getActiveProfileId(), 'custom');
    assert.strictEqual(CalibrationEngine.getVersion(), 'v1.0.1');
    assert.strictEqual(audit.diff.length, 1);
    assert.strictEqual(audit.diff[0].parameter, 'confidenceCollapseThreshold');
    assert.strictEqual(audit.diff[0].before, BALANCED_PROFILE.confidenceCollapseThreshold);
    assert.strictEqual(audit.diff[0].after, 0.50);

    const params = CalibrationEngine.getCalibration();
    assert.strictEqual(params.confidenceCollapseThreshold, 0.50);
  });
});
