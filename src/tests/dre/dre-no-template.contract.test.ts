import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../core/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../core/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../core/runtime/dre/DreExecutiveFactsBuilder';

test('DRE No Template Contract', async (t) => {
  const baseFacts: DreExecutiveFacts = {
    grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 400,
    contributionMarginValue: 600, contributionMarginRate: 0.6,
    fixedExpenses: 300, ebitda: 300, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0,
    ebitdaMargin: 0.20, netIncome: 200, netMargin: 0.2, breakEvenRevenue: 500,
    breakEvenCoverage: 2.0, breakEvenDistance: 500, safetyMargin: 0.5,
    revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
    operatingResultQuality: 0.66, extraordinaryResultShare: 0,
    fixedCostAbsorption: 3.33, operatingLeverageRisk: 0.3,
    hasMeaningfulHistory: false, historyMessage: null
  };

  await t.test('Should dynamically generate currentSituation without fixed templates', () => {
    // We check if it is concatenating the fragments dynamically by ensuring that the 
    // variables (the labels, the numbers, the history trend) are present and distinct.
    const policy1 = DreDecisionPolicyLayer.generatePolicy(baseFacts, DreEconomicScenario.PROFITABLE_SCALE);
    
    const facts2 = { ...baseFacts, netMargin: -0.10, breakEvenCoverage: 0.8, ebitdaMargin: -0.05 };
    const policy2 = DreDecisionPolicyLayer.generatePolicy(facts2, DreEconomicScenario.ECONOMIC_STRESS);
    
    assert.notStrictEqual(policy1.executiveDiagnosis.currentSituation, policy2.executiveDiagnosis.currentSituation);
    
    // Check if the strings look like they are compiled and not just a single static string
    assert.ok(policy1.executiveDiagnosis.currentSituation.includes('Operação estruturada com'));
    assert.ok(policy2.executiveDiagnosis.currentSituation.includes('Operação estruturada com'));
  });
});
