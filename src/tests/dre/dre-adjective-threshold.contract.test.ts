import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../capabilities/financial/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../capabilities/financial/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

test('DRE Adjective Threshold Contract', async (t) => {
  const baseFacts: DreExecutiveFacts = {
    grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 400,
    contributionMarginValue: 600, contributionMarginRate: 0.6,
    fixedExpenses: 300, ebitda: 300, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0,
    ebitdaMargin: 0.20,
    netIncome: 200, netMargin: 0.2, breakEvenRevenue: 500,
    breakEvenCoverage: 2.0, breakEvenDistance: 500, safetyMargin: 0.5,
    revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
    operatingResultQuality: 0.66, extraordinaryResultShare: 0,
    fixedCostAbsorption: 3.33, operatingLeverageRisk: 0.3,
    hasMeaningfulHistory: false, historyMessage: null
  };

  await t.test('Should not use adjective "robusta" without meeting the rigid threshold', () => {
    // 1. Not robust (EBITDA < 25%)
    const notRobustFacts = { ...baseFacts, ebitdaMargin: 0.20, netMargin: 0.15 };
    const notRobustPolicy = DreDecisionPolicyLayer.generatePolicy(notRobustFacts, DreEconomicScenario.PROFITABLE_SCALE);
    const notRobustStr = JSON.stringify(notRobustPolicy).toLowerCase();
    
    assert.ok(
      !notRobustStr.includes('robusta'),
      'Must NOT use adjective "robusta" if ebitda < 25%'
    );

    // 2. Robust Scenario (EBITDA >= 25% && Net >= 10%)
    const robustFacts = { ...baseFacts, ebitdaMargin: 0.30, netMargin: 0.15 };
    const robustPolicy = DreDecisionPolicyLayer.generatePolicy(robustFacts, DreEconomicScenario.ACCELERATED_VALUE_CREATION);
    const robustStr = JSON.stringify(robustPolicy).toLowerCase();
    
    assert.ok(
      robustStr.includes('robusta'),
      'MUST use adjective "robusta" when thresholds are met'
    );
  });

  await t.test('Should not use adjective "saudável" when net margin is < 3%', () => {
    const unhealthyFacts = { ...baseFacts, netMargin: 0.01, breakEvenCoverage: 1.5 };
    const unhealthyPolicy = DreDecisionPolicyLayer.generatePolicy(unhealthyFacts, DreEconomicScenario.PROFITABLE_SCALE);
    const unhealthyStr = JSON.stringify(unhealthyPolicy).toLowerCase();
    
    assert.ok(
      !unhealthyStr.includes('saudável'),
      'Must NOT use adjective "saudável" if net margin < 3%'
    );

    const healthyFacts = { ...baseFacts, netMargin: 0.05, breakEvenCoverage: 1.5 };
    const healthyPolicy = DreDecisionPolicyLayer.generatePolicy(healthyFacts, DreEconomicScenario.PROFITABLE_SCALE);
    const healthyStr = JSON.stringify(healthyPolicy).toLowerCase();
    
    assert.ok(
      healthyStr.includes('saudável'),
      'MUST use adjective "saudável" if net margin >= 3% and coverage >= 1.2'
    );
  });
});
