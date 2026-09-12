import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { ExecutiveSemanticRegistry } from '../../workspace/runtime/executive-consolidation/ExecutiveSemanticRegistry';
import { BalanceSheetExecutiveViewModelBuilder } from '../../workspace/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

describe('BalanceSheetNarrativeClosure Contract', () => {
  it('should test plan builder logic via view model builder', () => {
    const rawData = {
      context: { stage: 'CRISE' },
      rawFinancialData: {
        financialIndicators: [
          { metricName: 'Liquidez Corrente', value: 0.5 },
          { metricName: 'Autonomia Financeira', value: 0.1 }
        ]
      }
    };
    const vm = BalanceSheetExecutiveViewModelBuilder.build(rawData);
    assert.ok(vm.observacaoFinanceira || vm.executiveOpinion, 'Should generate plan or opinion for survival');
  });

  it('should sanitize EXPANSION_WITH_DISCIPLINE blocking excess terms', () => {
    const input = 'Temos capital parado e excesso de caixa, podendo pagar dividendos.';
    const output = ExecutiveSemanticRegistry.sanitizeNarrative(input, 'EXPANSION_WITH_DISCIPLINE');
    
    assert.ok(!output.includes('capital parado'));
    assert.ok(!output.includes('excesso'));
    assert.ok(!output.includes('dividendos'));
    assert.ok(output.includes('liquidez estratégica alocada') || output.includes('reservas de liquidez'));
  });

  it('should sanitize EXCESS_LIQUIDITY_OPTIMIZATION blocking urgency terms', () => {
    const input = 'Precisamos agir com urgência devido à pressão operacional crítico.';
    const output = ExecutiveSemanticRegistry.sanitizeNarrative(input, 'EXCESS_LIQUIDITY_OPTIMIZATION');
    
    assert.ok(!output.includes('urgência'));
    assert.ok(!output.includes('pressão operacional'));
    assert.ok(!output.includes('crítico'));
  });
});
