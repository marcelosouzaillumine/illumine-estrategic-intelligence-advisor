import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { DreExecutiveViewModelBuilder } from '../../capabilities/financial/runtime/dre/DreExecutiveViewModelBuilder';

describe('DRE SSOT Regression', () => {
  it('must not return "Análise em Calibração" or 50/100 when valid cascadeResult exists', () => {
    const rawPayload = {
      // Intentionally passing empty root metrics to simulate a broken legacy pipeline
      recLiquida: 0,
      ebitda: 0,
      lucroLiq: 0,
      pontoEquilibrio: 0,
      // The single source of truth
      cascadeResult: [
        { id: 'ROL', value: 4438117.20 },
        { id: 'CUSTOS', value: 1400000.00 },
        { id: 'EBITDA', value: 1392105.60 },
        { id: 'LUCRO_LIQ', value: 1387072.12 },
        { id: 'DESP_OPER', value: 1600000.00 }
      ]
    };

    const vm = DreExecutiveViewModelBuilder.build(rawPayload, []);

    assert.strictEqual(vm.isValid, true);
    assert.notStrictEqual(vm.scenario, 'UNCATEGORIZED');
    
    // Check that health index is NOT 50
    assert.notStrictEqual(vm.policy.healthIndex, 50);
    
    // Check that positioning is NOT "Análise em Calibração"
    assert.notStrictEqual(vm.policy.economicPositioning, "Análise em Calibração");
    
    // Ensure coverage is > 1.5
    assert.ok(vm.facts.breakEvenCoverage > 1.5);
    
    // Check that it reached ACCELERATED_VALUE_CREATION or PROFITABLE_SCALE
    assert.ok(
      vm.scenario === 'ACCELERATED_VALUE_CREATION' || 
      vm.scenario === 'PROFITABLE_SCALE'
    );
  });
});
