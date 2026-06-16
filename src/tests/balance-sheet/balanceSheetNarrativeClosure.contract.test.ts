import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { BalanceSheetExecutivePlanBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutivePlanBuilder';
import { ExecutiveSemanticRegistry } from '../../core/runtime/executive-consolidation/ExecutiveSemanticRegistry';

describe('BalanceSheetNarrativeClosure Contract', () => {
  it('should not fallback to generic titles in PlanBuilder', () => {
    const planSurvival = BalanceSheetExecutivePlanBuilder.buildPlan('SURVIVAL', {}, 'CRISE', { liquidityCurrent: 0.5, financialAutonomy: 0.1 } as any);
    assert.strictEqual(planSurvival.planTitle, 'Proteção de Caixa e Continuidade');

    const planOptimization = BalanceSheetExecutivePlanBuilder.buildPlan('CAPITAL_OPTIMIZATION', {}, 'EXPANSÃO', { liquidityCurrent: 2.5, financialAutonomy: 0.8 } as any);
    assert.strictEqual(planOptimization.planTitle, 'Otimização de Capital Excedente');
  });

  it('should sanitize EXPANSION_WITH_DISCIPLINE blocking excess terms', () => {
    const input = 'Temos capital parado e excesso de caixa, podendo pagar dividendos.';
    const output = ExecutiveSemanticRegistry.sanitizeNarrative(input, 'EXPANSION_WITH_DISCIPLINE');
    
    assert.ok(!output.includes('capital parado'));
    assert.ok(!output.includes('excesso'));
    assert.ok(!output.includes('dividendos'));
    assert.ok(output.includes('liquidez estratégica alocada'));
  });

  it('should sanitize EXCESS_LIQUIDITY_OPTIMIZATION blocking urgency terms', () => {
    const input = 'Precisamos agir com urgência devido à pressão operacional crítico.';
    const output = ExecutiveSemanticRegistry.sanitizeNarrative(input, 'EXCESS_LIQUIDITY_OPTIMIZATION');
    
    assert.ok(!output.includes('urgência'));
    assert.ok(!output.includes('pressão operacional'));
    assert.ok(!output.includes('crítico'));
    assert.ok(output.includes('monitoramento contínuo'));
  });
});
