import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DreExecutiveViewModelBuilder } from '../../core/runtime/dre/DreExecutiveViewModelBuilder';

test('dreSingleSourceOfTruth: todos os KPIs devem residir e vir do DreExecutiveViewModelBuilder', () => {
  const payload = {
    cascadeResult: [
      { id: 'ROB', value: 12000 },
      { id: 'DED', value: -2000 },
      { id: 'ROL', value: 10000 },
      { id: 'CUSTOS', value: -4000 },
      { id: 'LUCRO_BRUTO', value: 6000 },
      { id: 'DESP_OPER', value: -2000 },
      { id: 'EBITDA', value: 4000 },
      { id: 'EBIT', value: 3800 },
      { id: 'LUCRO_LIQ', value: 2000 }
    ],
    pontoEquilibrio: 3333.33
  };

  const vm = DreExecutiveViewModelBuilder.build(payload);
  
  assert.ok(vm.executiveMetrics);
  assert.strictEqual(vm.executiveMetrics.receitaLiquida, 10000);
  assert.strictEqual(vm.executiveMetrics.lucroBruto, 6000);
  assert.strictEqual(vm.executiveMetrics.margemBruta, 0.6); // 6k / 10k
  assert.strictEqual(vm.executiveMetrics.margemContrib, 6000); // 10k - 4k
  assert.strictEqual(vm.executiveMetrics.indiceMargemContrib, 0.6);
  assert.strictEqual(vm.executiveMetrics.ebitda, 4000);
  assert.strictEqual(vm.executiveMetrics.margemEbitda, 0.4);
  assert.strictEqual(vm.executiveMetrics.ebit, 3800);
  assert.strictEqual(vm.executiveMetrics.margemEbit, 0.38);
  assert.strictEqual(vm.executiveMetrics.lucroLiq, 2000);
  assert.strictEqual(vm.executiveMetrics.margemLiquida, 0.2);
});
