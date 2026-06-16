import test from 'node:test';
import assert from 'node:assert';
import { DreExecutiveViewModelBuilder } from '../../core/runtime/dre/DreExecutiveViewModelBuilder';
import { DRE_SEMANTIC_BLACKLIST } from '../../core/runtime/dre/DreSemanticRegistry';

test('DRE Domain Isolation: Constitutional Purge Test', async (t) => {

  const checkSemanticIsolation = (text: string, context: string) => {
    if (!text) return;
    const normalized = text.toLowerCase();
    for (const term of DRE_SEMANTIC_BLACKLIST) {
      assert.ok(
        !normalized.includes(term.toLowerCase()),
        `[BP Semantic Leak] The term "${term}" was found in DRE output (${context}). Text: "${text}"`
      );
    }
  };

  const validateViewModel = (vm: any, scenarioLabel: string) => {
    assert.strictEqual(vm.isValid, true);
    
    // Check executiveDiagnosis
    const diag = vm.policy.executiveDiagnosis;
    checkSemanticIsolation(diag.currentSituation, `${scenarioLabel} - currentSituation`);
    checkSemanticIsolation(diag.strategicPriority, `${scenarioLabel} - strategicPriority`);
    checkSemanticIsolation(diag.operationalOutlook, `${scenarioLabel} - operationalOutlook`);
    checkSemanticIsolation(diag.primaryRecommendation, `${scenarioLabel} - primaryRecommendation`);
    checkSemanticIsolation(diag.primaryEconomicDriver, `${scenarioLabel} - primaryEconomicDriver`);
    
    // Check boardQuestions
    Object.values(vm.policy.boardQuestions).forEach((bq: any, idx: number) => {
      checkSemanticIsolation(bq.response, `${scenarioLabel} - BQ${idx} response`);
      checkSemanticIsolation(bq.rationale, `${scenarioLabel} - BQ${idx} rationale`);
      checkSemanticIsolation(bq.recommendation, `${scenarioLabel} - BQ${idx} recommendation`);
    });
    
    // Check executivePlan
    checkSemanticIsolation(vm.policy.executivePlan.shortTerm, `${scenarioLabel} - shortTerm`);
    checkSemanticIsolation(vm.policy.executivePlan.mediumTerm, `${scenarioLabel} - mediumTerm`);
    checkSemanticIsolation(vm.policy.executivePlan.longTerm, `${scenarioLabel} - longTerm`);
    
    // Check Engine Isolation
    const payloadStr = JSON.stringify(vm);
    assert.ok(!payloadStr.includes('ExecutiveDecisionSynthesisEngine'), 'Should not contain references to the shared BP engine.');
  };

  await t.test('Should not leak BP concepts in ACCELERATED_VALUE_CREATION', () => {
    const vm = DreExecutiveViewModelBuilder.build({
      receitaBruta: 100000,
      deducoesReceita: -10000,
      recLiquida: 90000,
      custosVar: -30000,
      despesasFixas: -10000,
      lucroLiq: 50000,
      ebitda: 60000
    });
    
    validateViewModel(vm, 'ACCELERATED_VALUE_CREATION');
  });

  await t.test('Should not leak BP concepts in MARGIN_COMPRESSION', () => {
    const vm = DreExecutiveViewModelBuilder.build({
      receitaBruta: 100000,
      deducoesReceita: 0,
      recLiquida: 100000,
      custosVar: -70000,
      despesasFixas: -25000,
      lucroLiq: 5000,
      ebitda: 5000
    });
    
    validateViewModel(vm, 'MARGIN_COMPRESSION');
  });

  await t.test('Should not leak BP concepts in STRUCTURE_ABSORPTION_RISK', () => {
    const vm = DreExecutiveViewModelBuilder.build({
      receitaBruta: 100000,
      deducoesReceita: 0,
      recLiquida: 100000,
      custosVar: -40000,
      despesasFixas: -55000,
      lucroLiq: 5000,
      ebitda: 5000
    });
    
    validateViewModel(vm, 'STRUCTURE_ABSORPTION_RISK');
  });

  await t.test('Should not leak BP concepts in ECONOMIC_STRESS', () => {
    const vm = DreExecutiveViewModelBuilder.build({
      receitaBruta: 100000,
      deducoesReceita: 0,
      recLiquida: 100000,
      custosVar: -80000,
      despesasFixas: -40000,
      lucroLiq: -20000,
      ebitda: -20000
    });
    
    validateViewModel(vm, 'ECONOMIC_STRESS');
  });
});
