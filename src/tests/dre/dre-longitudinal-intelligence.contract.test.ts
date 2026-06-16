import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../core/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../core/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../core/runtime/dre/DreExecutiveFactsBuilder';

test('DRE Longitudinal Intelligence Contract', async (t) => {
  const baseFacts: DreExecutiveFacts = {
    grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 400,
    contributionMarginValue: 600, contributionMarginRate: 0.6,
    fixedExpenses: 300, ebitda: 300, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0,
    ebitdaMargin: 0.20, netIncome: 200, netMargin: 0.2, breakEvenRevenue: 500,
    breakEvenCoverage: 2.0, breakEvenDistance: 500, safetyMargin: 0.5,
    revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
    operatingResultQuality: 0.66, extraordinaryResultShare: 0,
    fixedCostAbsorption: 3.33, operatingLeverageRisk: 0.3,
    hasMeaningfulHistory: true, historyMessage: null
  };

  await t.test('Should differentiate narrative based purely on historical growth trends, even with identical present numbers', () => {
    // Both have identical current margins, but different historical vectors
    const improvingFacts = { ...baseFacts, netIncomeGrowth: 0.10, netMargin: 0.20 };
    const policyImproving = DreDecisionPolicyLayer.generatePolicy(improvingFacts, DreEconomicScenario.PROFITABLE_SCALE);

    const deterioratingFacts = { ...baseFacts, netMargin: -0.10, netIncomeGrowth: -0.15 };
    const policyDeteriorating = DreDecisionPolicyLayer.generatePolicy(deterioratingFacts, DreEconomicScenario.PROFITABLE_SCALE);

    const curr1 = policyImproving.executiveDiagnosis.currentSituation;
    const curr2 = policyDeteriorating.executiveDiagnosis.currentSituation;

    assert.notStrictEqual(curr1, curr2, 'Longitudinal data must modify the currentSituation narrative dynamically');
    
    // Specifically looking for the compiled phrases
    assert.ok(curr1.includes('estabilidade da geração de resultados'), 'Should detect strong capacity');
    assert.ok(curr2.includes('tensionam as margens operacionais correntes'), 'Should detect deterioration');
  });
});
