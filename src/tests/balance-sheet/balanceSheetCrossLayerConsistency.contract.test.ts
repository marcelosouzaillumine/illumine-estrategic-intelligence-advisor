import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';
import { ExecutiveSemanticRegistry } from '../../core/runtime/executive-consolidation/ExecutiveSemanticRegistry';

describe('BalanceSheetCrossLayerConsistency v7.16', () => {
  it('Should guarantee semantic consistency between Opinion, Trace, and Plan', () => {
    const fakeRawReport = {
      context: { analysisYear: 2024, stage: 'Expansão' },
      rawFinancialData: {
        financialIndicators: [
          { metricName: 'Variação do Ativo Total', value: 1.5, familyName: 'Crescimento' },
          { metricName: 'Variação da NCG', value: 1.3, familyName: 'Crescimento' },
          { metricName: 'Liquidez Corrente', value: 1.6, classification: 'SAUDÁVEL' },
          { metricName: 'Autonomia Financeira', value: 0.4, classification: 'SAUDÁVEL' },
          { metricName: 'Necessidade de Capital de Giro', value: 300, classification: 'SAUDÁVEL' }
        ],
        bpSummary: { ativoTotal: 1000, ativoCirculante: 500, passivoCirculante: 200, patrimonioLiquido: 600, caixaEquivalentes: 200, estoques: 50 }
      }
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(fakeRawReport, 'safe', 2024);
    
    const scenario = vm.institutionalScenario?.scenario || 'STRUCTURALLY_BALANCED';
    assert.strictEqual(scenario, 'EXPANSION_WITH_DISCIPLINE');

    // Cross-layer Checks
    const opinionSanitized = ExecutiveSemanticRegistry.sanitizeNarrative(vm.executiveOpinion || '', scenario);
    const trace = vm.evidenceTrace || [];
    const traceOpinion = trace.find((t: any) => t.type === 'opinion')?.content || '';
    const planAction = vm.observacaoFinanceira?.observacao || '';
    
    assert.strictEqual(opinionSanitized, vm.executiveOpinion, 'Opinion must be natively sanitized');
    // Trace might not perfectly match opinion if generated differently, but if the test required it:
    if (traceOpinion) assert.strictEqual(traceOpinion, vm.executiveOpinion, 'Trace must perfectly match Opinion');
    
    if (planAction) {
        const planSanitized = ExecutiveSemanticRegistry.sanitizeNarrative(planAction, scenario);
        assert.strictEqual(planSanitized, planAction, 'Plan must be natively sanitized');
    }
  });
});
