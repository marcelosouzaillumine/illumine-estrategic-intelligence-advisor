import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../capabilities/financial/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../capabilities/financial/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

test('DRE Executive Determinism Contract', async (t) => {
  const baseFacts: DreExecutiveFacts = {
    grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 400,
    contributionMarginValue: 600, contributionMarginRate: 0.6,
    fixedExpenses: 300, ebitda: 300, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0,
    ebitdaMargin: 0.20, // baseline
    netIncome: 200, netMargin: 0.2, breakEvenRevenue: 500,
    breakEvenCoverage: 2.0, breakEvenDistance: 500, safetyMargin: 0.5,
    revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
    operatingResultQuality: 0.66, extraordinaryResultShare: 0,
    fixedCostAbsorption: 3.33, operatingLeverageRisk: 0.3,
    hasMeaningfulHistory: false, historyMessage: null
  };

  await t.test('Should not use "robusta" or "excepcional" without strong numerical triggers in ACCELERATED_VALUE_CREATION', () => {
    // facts with modest margins
    const factsNormal = { ...baseFacts, ebitdaMargin: 0.25, breakEvenCoverage: 1.6 };
    const policyNormal = DreDecisionPolicyLayer.generatePolicy(factsNormal, DreEconomicScenario.ACCELERATED_VALUE_CREATION);
    
    const payloadNormal = JSON.stringify(policyNormal).toLowerCase();
    assert.ok(
      !payloadNormal.includes('excepcional') && !payloadNormal.includes('rentabilidade robusta'),
      'Must not use "excepcional" or "robusta" without a numerical trigger.'
    );

    // facts with very strong margins
    const factsStrong = { ...baseFacts, ebitdaMargin: 0.40, breakEvenCoverage: 2.5 };
    const policyStrong = DreDecisionPolicyLayer.generatePolicy(factsStrong, DreEconomicScenario.ACCELERATED_VALUE_CREATION);
    
    const payloadStrong = JSON.stringify(policyStrong).toLowerCase();
    assert.ok(
      payloadStrong.includes('robusta'),
      'Must use "robusta" when numerical triggers (EBITDA > 35%, BE > 2.0) are met.'
    );
  });

  await t.test('Should classify as "em recuperação" only when margin is fragile in PROFITABLE_SCALE', () => {
    // facts with strong margin
    const factsStrong = { ...baseFacts, netMargin: 0.15, breakEvenCoverage: 2.0 };
    const policyStrong = DreDecisionPolicyLayer.generatePolicy(factsStrong, DreEconomicScenario.PROFITABLE_SCALE);
    
    const payloadStrong = JSON.stringify(policyStrong).toLowerCase();
    assert.ok(
      !payloadStrong.includes('em recuperação') && !payloadStrong.includes('mínima'),
      'Must not classify as "em recuperação" when net margin is high.'
    );

    // facts with fragile margin
    const factsFragile = { ...baseFacts, netMargin: 0.04, breakEvenCoverage: 1.4, hasMeaningfulHistory: true };
    const policyFragile = DreDecisionPolicyLayer.generatePolicy(factsFragile, DreEconomicScenario.PROFITABLE_SCALE);
    
    const payloadFragile = JSON.stringify(policyFragile).toLowerCase();
    assert.ok(
      payloadFragile.includes('atenção à disciplina'),
      'Must recommend attention to discipline when margin is fragile (< 5%).'
    );
  });
});
