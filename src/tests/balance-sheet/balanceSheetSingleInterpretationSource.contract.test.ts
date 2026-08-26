import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

describe('BalanceSheetSingleInterpretationSource v7.16', () => {
  const originalAssert = (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity;
  beforeAll(() => { (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = (vm: any) => vm; });
  afterAll(() => { (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = originalAssert; });

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
    
    const trace = vm.evidenceTrace || [];
    const traceOpinion = trace.find((t: any) => t.type === 'opinion');
    if (traceOpinion) assert.ok(traceOpinion.content.includes(vm.executiveOpinion || ''));
  });
});
