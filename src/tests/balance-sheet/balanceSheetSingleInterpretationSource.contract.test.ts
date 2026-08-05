// @ts-nocheck
import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

describe('BalanceSheetSingleInterpretationSource v7.16', () => {
  it('Should generate all presentation fields without relying on missing intelligence report', () => {
    const fakeRawReport = {
      context: { analysisYear: 2024, stage: 'Maturidade' },
      rawFinancialData: {
        financialIndicators: [
          { metricName: 'Liquidez Corrente', value: 2.5 },
        ]
      },
      bpSummary: { ativoTotal: 1000, ativoCirculante: 500, passivoCirculante: 200, patrimonioLiquido: 600 }
    };

    const vm = BalanceSheetExecutiveViewModelBuilder.build(fakeRawReport, 'safe', 2024);
    
    assert.ok(vm.executiveOpinion, 'Should generate opinion natively from builder');
    assert.ok(vm.decisionTrace && vm.decisionTrace.length > 0, 'Should generate trace natively from builder');
    
    const traceOpinion = vm.decisionTrace?.find(t => t.type === 'opinion');
    assert.ok(traceOpinion?.content.includes(vm.executiveOpinion));
  });
});
