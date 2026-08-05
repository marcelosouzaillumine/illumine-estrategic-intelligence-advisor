// @ts-nocheck
import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

describe('BalanceSheetExecutiveNarrativeConsistency v7.16', () => {
  it('Should generate all narratives from the exact same InstitutionalScenario without contradiction', () => {
    const fakeRawReport = {
      context: { analysisYear: 2024, stage: 'Expansão' },
      rawFinancialData: {
        financialIndicators: [
          { metricName: 'Liquidez Corrente', value: 1.6, classification: 'SAUDÁVEL' },
          { metricName: 'Autonomia Financeira', value: 0.4, classification: 'SAUDÁVEL' },
          { metricName: 'Variação do Ativo Total', value: 1.5, familyName: 'Crescimento' },
          { metricName: 'Variação da NCG', value: 1.3, familyName: 'Crescimento' },
          { metricName: 'Necessidade de Capital de Giro', value: 300, classification: 'SAUDÁVEL' }
        ],
        bpSummary: { ativoTotal: 1000, ativoCirculante: 500, passivoCirculante: 200, patrimonioLiquido: 600, caixaEquivalentes: 200, estoques: 50 }
      }
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(fakeRawReport, 'safe', 2024);
    
    assert.ok(vm.institutionalScenario, 'Should generate institutional scenario');
    assert.strictEqual(vm.institutionalScenario.scenario, 'EXPANSION_WITH_DISCIPLINE');

    // 1. Executive Opinion is now driven by numerical structure
    assert.ok(vm.executiveOpinion?.includes('1.6') || vm.executiveOpinion?.includes('60.0%'));
    
    // 2. Decision Trace matches exact string
    const trace = vm.decisionTrace || [];
    const opinionNode = trace.find((t: any) => t.type === 'opinion');
    assert.strictEqual(opinionNode?.content, vm.executiveOpinion);

    // 3. Recommended Action driven by numbers
    assert.ok(vm.recommendedAction?.includes('conversão de capital de giro') || vm.recommendedAction?.includes('alavancagem') || vm.recommendedAction?.includes('Manter disciplina'));

    // 4. Plan Financeiro
    assert.ok(!vm.planFinanceiro.acao.toLowerCase().includes('excesso estrutural'));
    assert.ok(!vm.planFinanceiro.acao.toLowerCase().includes('dividendos extraordinários'));
  });
});
