import test from 'node:test';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

test('BalanceSheet Longitudinal Calibration: Adapts when data is present', () => {
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
});
