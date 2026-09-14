import { strict as assert } from 'assert';
import test from 'node:test';
import { orchestrateExecutiveConsolidation } from '../src/core/orchestration/executiveOrchestrationEngine';
import { CrossStatementPropagationEngine } from '../src/workspace/runtime/executive-consolidation/CrossStatementPropagationEngine';
import { ExecutiveNarrativeSanitizer } from '../src/workspace/runtime/executive-consolidation/ExecutiveNarrativeSanitizer';
import { EFOSExecutiveConsistencyAuditEngine } from '../src/workspace/runtime/executive-consolidation/EFOSExecutiveConsistencyAuditEngine';
import { EFOSPresentationLeakGuard } from '../src/workspace/runtime/executive-consolidation/EFOSPresentationLeakGuard';
import { CapitalProtectionCanonicalResolver } from '../src/workspace/runtime/executive-consolidation/CapitalProtectionCanonicalResolver';

test('EFOS Executive Binding, Sanitization & Hard Audit Framework (EBSHAF v1.0)', async (t) => {
  await t.test('CrossStatementPropagationEngine', async (t) => {
    await t.test('should detect mandatory DRE_DFC_DLPA tension', () => {
      const result = CrossStatementPropagationEngine.detect({
        lucroLiquido: -100,
        ebitda: -50,
        fco: -20,
        liquidezReal: 0,
        runway: 12, // Runway OK, but DRE/DFC/DLPA is broken
        capitalConsumido: 50,
        capitalConsumedPercent: 30
      });

      assert.strictEqual(result.hasTension, true);
      assert.ok(result.tensions.some(t => t.chain === 'DRE_DFC_DLPA'));
      assert.ok(result.tensions.some(t => t.severity === 'CRITICAL'));
      assert.ok(result.tensions.some(t => t.narrative.includes('O prejuízo econômico do exercício pressionou')));
    });

    await t.test('should append DFC_CONTINUITY_PRESSURE for low runway', () => {
      const result = CrossStatementPropagationEngine.detect({
        lucroLiquido: 100,
        ebitda: 150,
        fco: -20,
        liquidezReal: 0,
        runway: 1, // < 3
        capitalConsumido: 0,
        capitalConsumedPercent: 0
      });

      assert.strictEqual(result.hasTension, true);
      assert.ok(result.tensions.some(t => t.chain === 'DFC_CONTINUITY_PRESSURE'));
      assert.ok(result.tensions.some(t => t.severity === 'CRITICAL'));
    });
  });

  await t.test('CapitalProtectionCanonicalResolver', async (t) => {
    await t.test('should consume from DLPA strict', () => {
      const result = CapitalProtectionCanonicalResolver.resolve({
        dlpaCapitalStatus: 'Capital Fragilizado'
      });
      assert.strictEqual(result, 'Capital Fragilizado');
    });
  });

  await t.test('ExecutiveNarrativeSanitizer', async (t) => {
    await t.test('should remove [GROWTH], Parâmetros de divulgação, etc', () => {
      const raw = '[GROWTH] Maximizar retorno. Parâmetros de divulgação omitidos: teste. .: final. [[RUNTIME.TEST]]';
      const clean = ExecutiveNarrativeSanitizer.sanitize(raw);
      assert.ok(!clean.includes('[GROWTH]'));
      assert.ok(!clean.includes('Parâmetros'));
      assert.ok(!clean.includes('.:'));
      assert.ok(!clean.includes('[[RUNTIME.TEST]]'));
      assert.strictEqual(clean, 'Maximizar retorno. teste. final.');
    });
  });

  await t.test('EFOSPresentationLeakGuard', async (t) => {
    await t.test('should sanitize on render layer', () => {
      const val = EFOSPresentationLeakGuard.guard('Ação executiva [OPTIMIZATION]');
      assert.strictEqual(val, 'Ação executiva');
    });
  });

  await t.test('EFOSExecutiveConsistencyAuditEngine', async (t) => {
    await t.test('should flag BADI >= 70 without tension', () => {
      const res = EFOSExecutiveConsistencyAuditEngine.audit({
        badiScore: 80,
        boardTop3: [{ titulo: 'A', problema: 'B', impactoEsperado: 'C', text: 'D' } as any],
        lucroLiquido: 100, fco: 100, tensions: [],
        patrimonioLiquido: 100, capitalConsumido: 0, runwayMonths: 12,
        dominantRisk: 'Específico', priorityDecision: 'Específica',
        executiveTop5: []
      });
      assert.strictEqual(res.status, 'EFOS_EXECUTIVE_INCONSISTENT');
      assert.ok(res.violations.some(v => v.includes('BADI >= 70 mas não há tensão')));
    });

    await t.test('should flag capital protection divergence', () => {
      const res = EFOSExecutiveConsistencyAuditEngine.audit({
        badiScore: 50, boardTop3: [{ titulo: 'A', problema: 'B', impactoEsperado: 'C', text: 'D' } as any],
        lucroLiquido: 100, fco: 100, tensions: [],
        patrimonioLiquido: 100, capitalConsumido: 0, runwayMonths: 12,
        dominantRisk: 'Específico', priorityDecision: 'Específica',
        dlpaCapitalStatus: 'Capital Fragilizado', snapshotCapitalProtectionStatus: 'Capital Preservado',
        executiveTop5: []
      } as any);
      assert.strictEqual(res.status, 'EFOS_EXECUTIVE_INCONSISTENT');
      assert.ok(res.violations.some(v => v.includes('Status de capital divergente: DLPA')));
    });

    await t.test('should flag incomplete board top 3', () => {
      const res = EFOSExecutiveConsistencyAuditEngine.audit({
        badiScore: 50, boardTop3: [{ titulo: 'A' } as any], // missing problema/impactoEsperado
        lucroLiquido: 100, fco: 100, tensions: [],
        patrimonioLiquido: 100, capitalConsumido: 0, runwayMonths: 12,
        dominantRisk: 'Específico', priorityDecision: 'Específica',
        dlpaCapitalStatus: 'Capital Preservado', snapshotCapitalProtectionStatus: 'Capital Preservado',
        executiveTop5: []
      });
      assert.strictEqual(res.status, 'EFOS_EXECUTIVE_INCONSISTENT');
      assert.ok(res.violations.some(v => v.includes('incompleta')));
    });

    await t.test('should flag executive technical leakage', () => {
      const res = EFOSExecutiveConsistencyAuditEngine.audit({
        badiScore: 50, boardTop3: [{ titulo: 'A', problema: 'B', impactoEsperado: 'C', text: 'D' } as any],
        lucroLiquido: 100, fco: 100, tensions: [],
        patrimonioLiquido: 100, capitalConsumido: 0, runwayMonths: 12,
        dominantRisk: 'Específico', priorityDecision: 'Específica',
        dlpaCapitalStatus: 'Capital Preservado', snapshotCapitalProtectionStatus: 'Capital Preservado',
        executiveTop5: [{ text: '[GROWTH] xyz', type: 'EXECUTIVE', impact: 'Baixo' }]
      });
      assert.strictEqual(res.status, 'EFOS_EXECUTIVE_INCONSISTENT');
      assert.ok(res.violations.some(v => v.includes('Vazamento técnico detectado')));
    });

    await t.test('should pass valid data for Granatum 2022 output', () => {
      const res = EFOSExecutiveConsistencyAuditEngine.audit({
        badiScore: 80,
        boardTop3: [
          { titulo: 'A', problema: 'B', impactoEsperado: 'C', text: 'D' } as any,
          { titulo: 'A', problema: 'B', impactoEsperado: 'C', text: 'D' } as any,
          { titulo: 'A', problema: 'B', impactoEsperado: 'C', text: 'D' } as any
        ],
        lucroLiquido: -100, fco: -100, tensions: [{ chain: 'DRE_DFC_DLPA', category: 'VALUE_DESTRUCTION_CHAIN', severity: 'CRITICAL', evidence: {}, narrative: '', source: 'CANONICAL_PROPAGATION' } as any],
        patrimonioLiquido: 100, capitalConsumido: 50, runwayMonths: 1,
        dominantRisk: 'Dependência de capital', priorityDecision: 'Atingir break-even',
        dlpaCapitalStatus: 'Capital Fragilizado', snapshotCapitalProtectionStatus: 'Capital Fragilizado',
        executiveTop5: [{ text: 'Executar revisão de custos', type: 'EXECUTIVE', impact: 'Baixo' }]
      });
      assert.strictEqual(res.status, 'EFOS_EXECUTIVE_CONSISTENT');
    });
  });
});
