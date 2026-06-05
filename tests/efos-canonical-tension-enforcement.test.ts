import test from 'node:test';
import { strict as assert } from 'assert';
import { CrossStatementPropagationEngine } from '../src/core/runtime/executive-consolidation/CrossStatementPropagationEngine';
import { CrossStatementPresentationGuard } from '../src/core/runtime/executive-consolidation/CrossStatementPresentationGuard';
import { CrossStatementBindingResolver } from '../src/core/runtime/executive-consolidation/CrossStatementBindingResolver';
import { EFOSExecutiveConsistencyAuditEngine } from '../src/core/runtime/executive-consolidation/EFOSExecutiveConsistencyAuditEngine';

test('EFOS Cross-Statement Canonical Tension Enforcement Patch (ECCTEP)', async (t) => {
  await t.test('1. Tensão sintética não renderiza em BOARD', () => {
    const syntheticTension: any = {
      chain: 'DRE_DFC_DLPA',
      category: 'VALUE_DESTRUCTION_CHAIN',
      severity: 'CRITICAL',
      narrative: 'Tensão fiduciária sintética',
      evidence: {},
      source: 'SYNTHETIC_GUARD'
    };
    const canRender = CrossStatementPresentationGuard.canRenderTension(syntheticTension, 'BOARD');
    assert.strictEqual(canRender, false);
  });

  await t.test('2. Tensão sintética não renderiza em EXECUTIVE', () => {
    const syntheticTension: any = {
      chain: 'DRE_DFC_DLPA',
      category: 'VALUE_DESTRUCTION_CHAIN',
      severity: 'CRITICAL',
      narrative: 'Tensão fiduciária sintética',
      evidence: {},
      source: 'SYNTHETIC_GUARD'
    };
    const canRender = CrossStatementPresentationGuard.canRenderTension(syntheticTension, 'EXECUTIVE');
    assert.strictEqual(canRender, false);
  });

  await t.test('3. Tensão sintética só aparece em DEBUG/TECHNICAL', () => {
    const syntheticTension: any = {
      chain: 'DRE_DFC_DLPA',
      category: 'VALUE_DESTRUCTION_CHAIN',
      severity: 'CRITICAL',
      narrative: 'Tensão fiduciária sintética',
      evidence: {},
      source: 'SYNTHETIC_GUARD'
    };
    const canRenderDebug = CrossStatementPresentationGuard.canRenderTension(syntheticTension, 'DEBUG');
    const canRenderTechnical = CrossStatementPresentationGuard.canRenderTension(syntheticTension, 'TECHNICAL');
    assert.strictEqual(canRenderDebug, true);
    assert.strictEqual(canRenderTechnical, true);
  });

  await t.test('4. Granatum 2022 exibe DRE_DFC_DLPA canônico', () => {
    const result = CrossStatementPropagationEngine.detect({
      lucroLiquido: -500000,
      ebitda: -300000,
      fco: -100000,
      liquidezReal: 0.5,
      runway: 1,
      capitalConsumido: 150000,
      capitalConsumedPercent: 100
    });

    const dreDfcDlpaTension = result.tensions.find(t => t.chain === 'DRE_DFC_DLPA');
    assert.ok(dreDfcDlpaTension);
    assert.strictEqual(dreDfcDlpaTension!.category, 'VALUE_DESTRUCTION_CHAIN');
    assert.strictEqual(dreDfcDlpaTension!.severity, 'CRITICAL');
    assert.strictEqual(dreDfcDlpaTension!.narrative, 'O prejuízo econômico do exercício pressionou a geração operacional de caixa e reduziu a preservação do capital aportado pelos sócios.');
    assert.strictEqual(dreDfcDlpaTension!.source, 'CANONICAL_PROPAGATION');
  });

  await t.test('5. BADI alto + tensions vazio gera CROSS_STATEMENT_BINDING_FAILURE', () => {
    assert.throws(() => {
      CrossStatementBindingResolver.resolve([], 85, []);
    }, (err: Error) => {
      assert.ok(err.message.includes('CROSS_STATEMENT_BINDING_FAILURE'));
      const payload = JSON.parse(err.message);
      assert.strictEqual(payload.error, 'CROSS_STATEMENT_BINDING_FAILURE');
      assert.strictEqual(payload.badiScore, 85);
      return true;
    });
  });

  await t.test('6. Nenhum texto técnico aparece em Cross-Statement (Audit falha)', () => {
    const input: any = {
      badiScore: 85,
      boardTop3: [
        { titulo: 'A', problema: 'B', impactoEsperado: 'C', urgencyLabel: 'Crítica' }
      ],
      executiveTop5: [],
      tensions: [
        {
          chain: 'DRE_DFC_DLPA',
          category: 'VALUE_DESTRUCTION_CHAIN',
          severity: 'CRITICAL',
          narrative: 'Tensão fiduciária sintética',
          evidence: {},
          source: 'SYNTHETIC_GUARD'
        }
      ],
      lucroLiquido: -1,
      fco: -1,
      capitalConsumido: 1,
      dominantRisk: 'Risco',
      priorityDecision: 'Decisão'
    };

    const audit = EFOSExecutiveConsistencyAuditEngine.audit(input);
    const hasSourceViolation = audit.violations.some(v => v.includes('Tensão com source !== CANONICAL_PROPAGATION é proibida na camada executiva/board.'));
    assert.strictEqual(hasSourceViolation, true);
    assert.strictEqual(audit.status, 'EFOS_EXECUTIVE_INCONSISTENT');
  });
});
