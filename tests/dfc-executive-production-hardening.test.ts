import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FiduciaryRuntimeAdapter } from '../src/services/FiduciaryRuntimeAdapter';

describe('DFC Executive Production Hardening & Final Structural Alignment v1.3 Tests', () => {

  it('1. ExecutivePresentationAuditEngine detects forbidden technical acronyms (DFC, CDIL, DRE, BP, etc.) under BOARD/EXECUTIVE', () => {
    const dirtyData = {
      title: 'Resumo da DFC Executivo',
      status: 'CRITICAL',
      details: 'CDIL fiduciário identificou risco fiduciário'
    };

    const boardAudit = FiduciaryRuntimeAdapter.ExecutivePresentationAuditEngine.audit(dirtyData, 'BOARD');
    assert.strictEqual(boardAudit.status, 'DFC_EXECUTIVE_PRESENTATION_VIOLATION');
    assert.ok(boardAudit.violations.length > 0);

    const execAudit = FiduciaryRuntimeAdapter.ExecutivePresentationAuditEngine.audit(dirtyData, 'EXECUTIVE');
    assert.strictEqual(execAudit.status, 'DFC_EXECUTIVE_PRESENTATION_VIOLATION');
    
    // In TECHNICAL mode, it must pass regardless of technical terms
    const techAudit = FiduciaryRuntimeAdapter.ExecutivePresentationAuditEngine.audit(dirtyData, 'TECHNICAL');
    assert.strictEqual(techAudit.status, 'PASS');
  });

  it('2. ExecutivePresentationAuditEngine passes clean executive-level models', () => {
    const cleanData = {
      title: 'Resumo de Caixa',
      status: 'Sustentabilidade Muito Alta',
      recommendation: 'Reduzir prazos de giro'
    };

    const boardAudit = FiduciaryRuntimeAdapter.ExecutivePresentationAuditEngine.audit(cleanData, 'BOARD');
    assert.strictEqual(boardAudit.status, 'PASS');
  });

  it('2.5. ExecutivePresentationAuditEngine allows DFC acronym inside technical keys but blocks in visual fields', () => {
    const technicalKeyData = {
      title: 'Resumo de Caixa',
      sourceModule: 'DFC',
      engineId: 'DFC_ENGINE_1',
      debug: 'DFC trace logs'
    };

    const boardAudit = FiduciaryRuntimeAdapter.ExecutivePresentationAuditEngine.audit(technicalKeyData, 'BOARD');
    assert.strictEqual(boardAudit.status, 'PASS');

    const visualKeyData = {
      title: 'Resumo da DFC',
      sourceModule: 'DFC'
    };

    const boardAuditVisual = FiduciaryRuntimeAdapter.ExecutivePresentationAuditEngine.audit(visualKeyData, 'BOARD');
    assert.strictEqual(boardAuditVisual.status, 'DFC_EXECUTIVE_PRESENTATION_VIOLATION');
    assert.ok(boardAuditVisual.violations.some(v => v.includes('Resumo da DFC')));
  });

  it('3. DFCBoardPriorityPresentationAdapter maps and normalizes raw ExecutivePriorities correctly', () => {
    const rawPriorities = [
      {
        title: 'Estancar queima de caixa operacional',
        rationale: 'A queima excessiva reduz o runway drásticamente.',
        severity: 'CRITICAL',
        sourceModule: 'DFC'
      },
      {
        title: 'Otimizar prazos de conversão',
        rationale: 'Faturamento alto mas sem caixa.',
        severity: 'HIGH',
        sourceModule: 'DRE'
      }
    ];

    const adapted = FiduciaryRuntimeAdapter.DFCBoardPriorityPresentationAdapter.adapt(rawPriorities as any);
    assert.strictEqual(adapted.length, 2);

    // Assert priority 1 maps to liquidity preservation & very high impact
    assert.strictEqual(adapted[0].theme, 'Preservação de Liquidez');
    assert.strictEqual(adapted[0].impact, 'Impacto Muito Alto');
    assert.strictEqual(adapted[0].recommendation, 'Estancar queima de caixa operacional');

    // Assert priority 2 maps to cash conversion & high impact
    assert.strictEqual(adapted[1].theme, 'Conversão de Receita em Caixa');
    assert.strictEqual(adapted[1].impact, 'Impacto Alto');
  });

  it('4. DFCSnapshotBindingAudit detects missing fiduciarily complete fields in snapshot', () => {
    const incompleteSnapshot = {
      cashGenerationStatus: 'Gera Caixa',
      runwayStatus: '12 meses'
      // shareholderDependencyStatus, primaryRisk, recommendedAction are missing
    };

    const auditResult = FiduciaryRuntimeAdapter.DFCSnapshotBindingAudit.audit(incompleteSnapshot);
    assert.strictEqual(auditResult.status, 'DFC_SNAPSHOT_BINDING_INCOMPLETE');
    assert.deepEqual(auditResult.missingFields, ['shareholderDependencyStatus', 'primaryRisk', 'recommendedAction']);

    const completeSnapshot = {
      cashGenerationStatus: 'Gera Caixa',
      runwayStatus: '12 meses',
      shareholderDependencyStatus: 'Nenhuma',
      primaryRisk: 'Nenhum',
      recommendedAction: 'Manter a operação'
    };

    const passResult = FiduciaryRuntimeAdapter.DFCSnapshotBindingAudit.audit(completeSnapshot);
    assert.strictEqual(passResult.status, 'PASS');
  });

  it('5. ExecutiveConsequenceIntelligenceLayer (ECIL) computes correct consequence profiles', () => {
    // Critical state
    const criticalProfile = FiduciaryRuntimeAdapter.ExecutiveConsequenceIntelligenceLayer.evaluate(-50000, 2, -120000);
    assert.strictEqual(criticalProfile.impactHorizon, 'Imediato (0-3 meses)');
    assert.strictEqual(criticalProfile.reversibility, 'Recuperação difícil sem mudanças estruturais');
    assert.strictEqual(
      criticalProfile.consequenceOfInaction,
      'Se nenhuma ação for tomada, a instituição poderá ampliar sua dependência de capital externo, reduzir sua capacidade de investimento e aumentar sua exposição a riscos de continuidade operacional.'
    );

    // Let's also verify moderate state
    const moderateProfile = FiduciaryRuntimeAdapter.ExecutiveConsequenceIntelligenceLayer.evaluate(100, 4, -5000);
    assert.strictEqual(moderateProfile.impactHorizon, 'Curto Prazo (3-6 meses)');
    assert.strictEqual(moderateProfile.reversibility, 'Recuperação possível mediante ação rápida');
  });

  it('6. TreasurySustainabilityNarrativeEngine compiles consequence-oriented narratives', () => {
    const criticalNarrative = FiduciaryRuntimeAdapter.TreasurySustainabilityNarrativeEngine.evaluate(35, -5000, 2);
    assert.ok(criticalNarrative.includes('baixa sustentabilidade'));

    const healthyNarrative = FiduciaryRuntimeAdapter.TreasurySustainabilityNarrativeEngine.evaluate(85, 10000, 12);
    assert.ok(healthyNarrative.includes('capacidade consistente'));
  });

  it('7. ScenarioSimulationConsistencyEngine outputs executiveInterpretation for FCO vs Runway/Cash mismatch', () => {
    const conflictResult = FiduciaryRuntimeAdapter.ScenarioSimulationConsistencyEngine.evaluate(
      6, // simulated Runway (improves from 4)
      4, // current Runway
      20000, // simulated Cash (improves from 15000)
      15000, // current Cash
      -2000, // simulated FCO (deteriorates from -1000)
      -1000  // current FCO
    );

    assert.strictEqual(conflictResult.hasConflict, true);
    assert.strictEqual(conflictResult.severity, 'HIGH');
    assert.ok(conflictResult.narrative.includes('Alerta de Interpretação:'));
    assert.ok(conflictResult.executiveInterpretation.includes('liberação temporária de capital de giro'));
  });
});
