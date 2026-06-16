import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DreExecutiveViewModelBuilder } from '../../core/runtime/dre/DreExecutiveViewModelBuilder';

describe('DreExecutiveViewModel Contract', () => {
  it('must return isValid = false if netRevenue is 0', () => {
    const rawPayload = { netRevenue: 0 };
    const vm = DreExecutiveViewModelBuilder.build(rawPayload, []);
    assert.strictEqual(vm.isValid, false);
    assert.ok(vm.policy.executiveDiagnosis.currentSituation.includes('aguarda') || vm.policy.executiveDiagnosis.currentSituation.includes('ausência de faturamento'));
  });

  it('must populate all P1-P7 fields without empty strings', () => {
    const rawPayload = {
      cascadeResult: [
        { id: 'ROL', computedValue: 1000 },
        { id: 'CUSTOS', computedValue: 400 },
        { id: 'LUCRO_BRUTO', computedValue: 600 },
        { id: 'DESP_OPER', computedValue: 200 },
        { id: 'EBITDA', computedValue: 400 },
        { id: 'LUCRO_LIQ', computedValue: 300 }
      ],
      pontoEquilibrio: 500
    };
    const vm = DreExecutiveViewModelBuilder.build(rawPayload, []);
    
    assert.strictEqual(vm.isValid, true);
    
    const policy = vm.policy;
    assert.ok(policy.boardQuestions.p1ValueCreation.response.length > 0);
    assert.ok(policy.boardQuestions.p2StructureSupport.response.length > 0);
    assert.ok(policy.boardQuestions.p3EconomicEquilibrium.response.length > 0);
    assert.ok(policy.boardQuestions.p4PrimaryConstraint.response.length > 0);
    assert.ok(policy.boardQuestions.p5EconomicOpportunity.response.length > 0);
    assert.ok(policy.boardQuestions.p6InactionRisk.response.length > 0);
    assert.ok(policy.boardQuestions.p7BoardPriority.response.length > 0);
  });

  it('generates coherent health index based on scenario', () => {
    // A payload that triggers ECONOMIC_STRESS (EBITDA < 0)
    const stressPayload = {
      cascadeResult: [
        { id: 'ROL', computedValue: 1000 },
        { id: 'CUSTOS', computedValue: 800 },
        { id: 'LUCRO_BRUTO', computedValue: 200 },
        { id: 'DESP_OPER', computedValue: 400 },
        { id: 'EBITDA', computedValue: -200 },
        { id: 'LUCRO_LIQ', computedValue: -200 }
      ],
      pontoEquilibrio: 2000
    };
    const stressVm = DreExecutiveViewModelBuilder.build(stressPayload, []);
    assert.strictEqual(stressVm.scenario, 'ECONOMIC_STRESS');
    assert.ok(stressVm.policy.healthIndex <= 40);
    
    // A payload that triggers ACCELERATED_VALUE_CREATION
    const accelPayload = {
      cascadeResult: [
        { id: 'ROL', computedValue: 1000 },
        { id: 'CUSTOS', computedValue: 400 },
        { id: 'LUCRO_BRUTO', computedValue: 600 },
        { id: 'DESP_OPER', computedValue: 200 },
        { id: 'EBITDA', computedValue: 400 },
        { id: 'LUCRO_LIQ', computedValue: 300 }
      ],
      pontoEquilibrio: 333
    };
    const accelVm = DreExecutiveViewModelBuilder.build(accelPayload, []);
    assert.strictEqual(accelVm.scenario, 'ACCELERATED_VALUE_CREATION');
    assert.ok(accelVm.policy.healthIndex >= 85);
  });
});
