import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DreExecutiveViewModelBuilder } from '../../core/runtime/dre/DreExecutiveViewModelBuilder';

test('dreExecutiveConsistency: os KPIs devem refletir os cálculos internamente sem discrepância na UI', () => {
  const payload = {
    cascadeResult: [
      { id: 'ROL', value: 5000 },
      { id: 'CUSTOS', value: -1000 },
      { id: 'DESP_OPER', value: -1000 },
      { id: 'EBITDA', value: 3000 }
    ]
  };

  const vm = DreExecutiveViewModelBuilder.build(payload);
  
  const rec = vm.executiveMetrics.receitaLiquida;
  const cust = vm.executiveMetrics.margemContrib;
  
  assert.strictEqual(rec, 5000);
  assert.strictEqual(cust, 4000); // 5000 - 1000
  assert.strictEqual(vm.executiveMetrics.ebitda, 3000); // 4000 - 1000
});
