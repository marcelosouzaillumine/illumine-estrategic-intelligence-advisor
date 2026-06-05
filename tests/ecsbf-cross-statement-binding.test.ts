import { strict as assert } from 'assert';
import test from 'node:test';
import { CrossStatementPropagationEngine } from '../src/core/runtime/executive-consolidation/CrossStatementPropagationEngine';
import { CrossStatementBindingResolver } from '../src/core/runtime/executive-consolidation/CrossStatementBindingResolver';
import { CrossStatementPresentationGuard } from '../src/core/runtime/executive-consolidation/CrossStatementPresentationGuard';
import { EFOSExecutiveConsistencyAuditEngine } from '../src/core/runtime/executive-consolidation/EFOSExecutiveConsistencyAuditEngine';
import { ExecutiveActionCompletenessAudit } from '../src/core/runtime/executive-consolidation/ExecutiveActionCompletenessAudit';

test('ECSBF v1.0 - Cross-Statement Sovereign Binding Framework', async (t) => {
  await t.test('CrossStatementPropagationEngine - Returns Array of Entities (VALUE_DESTRUCTION_CHAIN & DFC_CONTINUITY_PRESSURE)', () => {
    const result = CrossStatementPropagationEngine.detect({
      lucroLiquido: -50,
      ebitda: -30,
      fco: -10,
      liquidezReal: 0,
      runway: 2,
      capitalConsumido: 20,
      capitalConsumedPercent: 10
    });

    assert.strictEqual(result.hasTension, true);
    assert.strictEqual(result.tensions.length, 2);
    
    const destruction = result.tensions.find(t => t.chain === 'DRE_DFC_DLPA');
    assert.ok(destruction);
    assert.strictEqual(destruction.category, 'VALUE_DESTRUCTION_CHAIN');
    assert.strictEqual(destruction.severity, 'CRITICAL');
    assert.strictEqual(destruction.evidence.netIncome, -50);

    const continuity = result.tensions.find(t => t.chain === 'DFC_CONTINUITY_PRESSURE');
    assert.ok(continuity);
    assert.strictEqual(continuity.category, 'CONTINUITY_RISK');
    assert.strictEqual(continuity.severity, 'CRITICAL');
    assert.strictEqual(continuity.evidence.runwayMonths, 2);
  });

  await t.test('CrossStatementBindingResolver - Throws CROSS_STATEMENT_FALLBACK_PROHIBITED if causal rupture', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    assert.throws(() => {
      CrossStatementBindingResolver.resolve([], 80, [{ titulo: 'Recapitalizar', urgencyLabel: 'Crítica' } as any]);
    }, (err: Error) => err.message.includes('CROSS_STATEMENT_FALLBACK_PROHIBITED'));
    
    process.env.NODE_ENV = oldEnv;
  });

  await t.test('CrossStatementBindingResolver - Always throws CROSS_STATEMENT_BINDING_FAILURE regardless of environment', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    assert.throws(() => {
      CrossStatementBindingResolver.resolve([], 80, [{ titulo: 'Recapitalizar', urgencyLabel: 'Crítica' } as any]);
    }, (err: Error) => err.message.includes('CROSS_STATEMENT_BINDING_FAILURE'));
    
    process.env.NODE_ENV = oldEnv;
  });

  await t.test('CrossStatementPresentationGuard - Blocks legacy UI if risk present', () => {
    assert.strictEqual(CrossStatementPresentationGuard.canRenderFallback([], 50, []), true);
    assert.strictEqual(CrossStatementPresentationGuard.canRenderFallback([{}] as any, 50, []), false);
    assert.strictEqual(CrossStatementPresentationGuard.canRenderFallback([], 80, []), false);
    assert.strictEqual(CrossStatementPresentationGuard.canRenderFallback([], 50, [{}] as any), false);
  });

  await t.test('ExecutiveActionCompletenessAudit - Degradation semantic if Top5 < 5', () => {
    const r1 = ExecutiveActionCompletenessAudit.auditAndFormatTitle([{}, {}, {}, {}, {}] as any);
    assert.strictEqual(r1.isComplete, true);
    assert.strictEqual(r1.title, 'Top 5 Ações da Diretoria');

    const r2 = ExecutiveActionCompletenessAudit.auditAndFormatTitle([{}, {}] as any);
    assert.strictEqual(r2.isComplete, false);
    assert.strictEqual(r2.title, 'Ações Prioritárias da Diretoria');
  });

  await t.test('EFOSExecutiveConsistencyAuditEngine - Hard ECSBF Rules', () => {
    // R11: BoardTop3 > 0 but no tensions
    const res1 = EFOSExecutiveConsistencyAuditEngine.audit({
      badiScore: 50,
      boardTop3: [{ titulo: 'A' }] as any,
      lucroLiquido: 10, fco: 10, capitalConsumido: 0,
      tensions: [],
      executiveTop5: [],
      dominantRisk: 'Dependência', priorityDecision: 'Atingir break-even'
    } as any);
    assert.ok(res1.violations.some(v => v.includes('BoardTop3 possui itens, mas nenhuma tensão cross-statement foi registrada. Ruptura causal.')));

    // R9: Value destruction triad but missing chain
    const res2 = EFOSExecutiveConsistencyAuditEngine.audit({
      badiScore: 50,
      boardTop3: [],
      lucroLiquido: -10, fco: -10, capitalConsumido: 10,
      tensions: [{ chain: 'DRE_DFC' }] as any,
      executiveTop5: [],
      dominantRisk: 'Dependência', priorityDecision: 'Atingir break-even'
    } as any);
    assert.ok(res2.violations.some(v => v.includes('Tríade de destruição de valor exige tensão DRE_DFC_DLPA')));
  });
});
