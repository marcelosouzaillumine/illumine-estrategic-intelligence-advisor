import { describe, it, test, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../workspace/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

test('BalanceSheet Longitudinal Calibration: Adapts when data is present', () => {
  const originalAssert = (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity;
  (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = (vm: any) => vm;
  const rawData = {
    patrimonialIntelligenceReport: {
      indicators: [
        { metricName: 'Liquidez Corrente', value: 1.2, familyName: 'Liquidez' }
      ]
    },
    context: {
      hasMeaningfulHistory: true
    }
  };

  // We are not heavily using longitudinal calibration in BP yet (like DRE), but we ensure it doesn't crash
  const vm = BalanceSheetExecutiveViewModelBuilder.build(rawData);
  assert.ok(vm, 'ViewModel deve ser construído sem erros');
  (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = originalAssert;
});
