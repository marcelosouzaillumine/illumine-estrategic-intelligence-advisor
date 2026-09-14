import { strict as assert } from 'assert';
import test from 'node:test';
import { CrossStatementPropagationEngine } from '../src/workspace/runtime/executive-consolidation/CrossStatementPropagationEngine';
import { CapitalProtectionCanonicalResolver } from '../src/workspace/runtime/executive-consolidation/CapitalProtectionCanonicalResolver';
import { ExecutiveNarrativeSanitizer } from '../src/workspace/runtime/executive-consolidation/ExecutiveNarrativeSanitizer';
import { ExecutiveRecommendationDeduplicationEngine } from '../src/workspace/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';
import { BoardDecisionMaterialityResolver } from '../src/workspace/runtime/executive-prioritization/BoardDecisionMaterialityResolver';
import { EFOSExecutiveConsistencyAuditEngine } from '../src/workspace/runtime/executive-consolidation/EFOSExecutiveConsistencyAuditEngine';

test('ECIF v1.0 - Executive Consolidation Integrity Framework', async (t) => {
  await t.test('CrossStatementPropagationEngine - CRITICAL Triad Entity', () => {
    const result = CrossStatementPropagationEngine.detect({
      lucroLiquido: -50,
      ebitda: -30,
      fco: -10,
      liquidezReal: 0,
      runway: 12,
      capitalConsumido: 20
    });

    assert.strictEqual(result.hasTension, true);
    
    const destruction = result.tensions.find(t => t.chain === 'DRE_DFC_DLPA');
    assert.ok(destruction);
    assert.strictEqual(destruction.severity, 'CRITICAL');
    assert.strictEqual(destruction.category, 'VALUE_DESTRUCTION_CHAIN');
    assert.strictEqual(destruction.evidence.netIncome, -50);
    assert.strictEqual(destruction.evidence.fco, -10);
    assert.strictEqual(destruction.evidence.capitalConsumed, 20);
  });

  await t.test('CapitalProtectionCanonicalResolver - Enforce Strict Taxonomy', () => {
    assert.strictEqual(CapitalProtectionCanonicalResolver.resolve({ capitalPreservedPercent: 49 }), 'Capital Fragilizado');
    assert.strictEqual(CapitalProtectionCanonicalResolver.resolve({ capitalPreservedPercent: 74 }), 'Capital em Recomposição');
    assert.strictEqual(CapitalProtectionCanonicalResolver.resolve({ capitalPreservedPercent: 99 }), 'Capital Preservado');
    assert.strictEqual(CapitalProtectionCanonicalResolver.resolve({ capitalPreservedPercent: 100 }), 'Capital Expandido');
  });

  await t.test('ExecutiveNarrativeSanitizer - Block non-verb recommendations', () => {
    const valid = ExecutiveNarrativeSanitizer.hasValidExecutiveVerb('Revisar estrutura de custos.');
    const invalid = ExecutiveNarrativeSanitizer.hasValidExecutiveVerb('A simulação de estresse indica falha.');
    const validWithGarbage = ExecutiveNarrativeSanitizer.hasValidExecutiveVerb('.: Implementar plano de ação');

    assert.strictEqual(valid, true);
    assert.strictEqual(invalid, false);
    assert.strictEqual(validWithGarbage, true);
  });

  await t.test('ExecutiveNarrativeSanitizer - Remove tags', () => {
    const clean = ExecutiveNarrativeSanitizer.sanitize('[CAPITAL] Aumentar caixa. Parâmetros de divulgação omitidos: x. [[RUNTIME.TEST]]');
    assert.strictEqual(clean, 'Aumentar caixa. x.');
  });

  await t.test('ExecutiveRecommendationDeduplicationEngine - Discard invalid actions', () => {
    const recs = ExecutiveRecommendationDeduplicationEngine.deduplicate([
      { text: 'A simulação mostra falha de caixa', type: 'EXECUTIVE', impact: 'Alto' },
      { text: 'Reduzir custos fixos', type: 'EXECUTIVE', impact: 'Alto' }
    ]);

    assert.strictEqual(recs.executiveTop5.length, 1);
    assert.strictEqual(recs.executiveTop5[0].text, 'Reduzir custos fixos');
  });

  await t.test('BoardDecisionMaterialityResolver - Prohibit Governance on Value Destruction', () => {
    const prohibited = BoardDecisionMaterialityResolver.prohibitDomains({
      netIncome: -10, fco: -10, capitalConsumed: 10, runwayMonths: 1, badiScore: 90
    });
    assert.ok(prohibited.includes('Governança'));
  });

  await t.test('EFOSExecutiveConsistencyAuditEngine - Hard ECIF Rules', () => {
    const result = EFOSExecutiveConsistencyAuditEngine.audit({
      badiScore: 80,
      boardTop3: [
        { titulo: 'A', problema: 'B', impactoEsperado: 'C', text: 'D' } as any
      ],
      lucroLiquido: -100, fco: -100, tensions: [{ chain: 'OTHER', category: 'CONTINUITY_RISK', severity: 'HIGH', evidence: {}, narrative: '', source: 'CANONICAL_PROPAGATION' } as any],
      patrimonioLiquido: 100, capitalConsumido: 50, runwayMonths: 1,
      dominantRisk: 'Dependência', priorityDecision: 'Atingir break-even',
      dlpaCapitalStatus: 'Capital Fragilizado', snapshotCapitalProtectionStatus: 'Capital Fragilizado',
      executiveTop5: [{ text: 'Executar corte', type: 'EXECUTIVE', impact: 'Alto' }]
    } as any);

    assert.strictEqual(result.status, 'EFOS_EXECUTIVE_INCONSISTENT');
    assert.ok(result.violations.some(v => v.includes('Tríade de destruição de valor exige tensionSeverity = CRITICAL')));
  });
});
