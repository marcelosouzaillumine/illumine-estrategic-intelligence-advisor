import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../core/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../core/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../core/runtime/dre/DreExecutiveFactsBuilder';

test('DRE Longitudinal Differentiation Contract', async (t) => {
  const mockFacts: DreExecutiveFacts = {
    grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 400,
    contributionMarginValue: 600, contributionMarginRate: 0.6,
    fixedExpenses: 300, ebitda: 300, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0, ebitdaMargin: 0.3,
    netIncome: 200, netMargin: 0.2, breakEvenRevenue: 500,
    breakEvenCoverage: 2.0, breakEvenDistance: 500, safetyMargin: 0.5,
    revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
    operatingResultQuality: 0.66, extraordinaryResultShare: 0,
    fixedCostAbsorption: 3.33, operatingLeverageRisk: 0.3,
    hasMeaningfulHistory: true, historyMessage: null
  };

  await t.test('Diferenciação narrativa entre margens moderadas e excepcionais no mesmo cenário (ACCELERATED_VALUE_CREATION)', () => {
    const factsNormal = { ...mockFacts, ebitdaMargin: 0.25, breakEvenCoverage: 1.5 };
    const factsExceptional = { ...mockFacts, ebitdaMargin: 0.40, breakEvenCoverage: 2.5 };

    const policyNormal = DreDecisionPolicyLayer.generatePolicy(factsNormal, DreEconomicScenario.ACCELERATED_VALUE_CREATION);
    const policyExceptional = DreDecisionPolicyLayer.generatePolicy(factsExceptional, DreEconomicScenario.ACCELERATED_VALUE_CREATION);

    assert.notStrictEqual(
      policyNormal.executiveDiagnosis.currentSituation, 
      policyExceptional.executiveDiagnosis.currentSituation,
      'Current Situation should be differentiated within the same scenario based on quantitative thresholds'
    );
    assert.ok(policyExceptional.executiveDiagnosis.currentSituation.includes('robusta'));
    assert.ok(policyNormal.executiveDiagnosis.currentSituation.includes('estabilidade da geração de resultados'));
  });

  await t.test('2022 (ECONOMIC_STRESS) uses institutional restructuring language instead of alarmist terms', () => {
    const policy2022 = DreDecisionPolicyLayer.generatePolicy(mockFacts, DreEconomicScenario.ECONOMIC_STRESS, 2022);
    const sit = policy2022.executiveDiagnosis.currentSituation;
    
    assert.ok(sit.includes('necessidade aguda de turnaround'), 'The text for 2022 should be correct.');
    assert.ok(!sit.includes('war room'));
    assert.ok(!sit.includes('sangria'));
  });
});
