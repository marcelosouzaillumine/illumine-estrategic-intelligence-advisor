import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../capabilities/financial/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../capabilities/financial/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

test('DRE Runtime Template Leak Contract', async (t) => {
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

  await t.test('Should not have identical currentSituation strings for quantitatively distinct scenarios', () => {
    // 1. Extreme Critical Scenario
    const criticalFacts = { ...baseFacts, netMargin: -0.10, breakEvenCoverage: 0.8, ebitdaMargin: -0.05 };
    const criticalPolicy = DreDecisionPolicyLayer.generatePolicy(criticalFacts, DreEconomicScenario.ECONOMIC_STRESS);
    
    // 2. High Margin Scenario
    const robustFacts = { ...baseFacts, netMargin: 0.25, breakEvenCoverage: 3.0, ebitdaMargin: 0.40 };
    const robustPolicy = DreDecisionPolicyLayer.generatePolicy(robustFacts, DreEconomicScenario.ACCELERATED_VALUE_CREATION);

    assert.notStrictEqual(
      criticalPolicy.executiveDiagnosis.currentSituation,
      robustPolicy.executiveDiagnosis.currentSituation,
      'Template Leak: Current Situation strings must be unique and dynamically generated'
    );
  });

  await t.test('Should not have identical Primary Recommendations for distinct causal origins', () => {
    // Causality: Break-even insufficient
    const breakEvenFacts = { ...baseFacts, netMargin: 0.05, breakEvenCoverage: 0.9, ebitdaMargin: 0.10 };
    const breakEvenPolicy = DreDecisionPolicyLayer.generatePolicy(breakEvenFacts, DreEconomicScenario.STRUCTURE_ABSORPTION_RISK);
    
    // Causality: Profitability insufficient
    const marginFacts = { ...baseFacts, netMargin: -0.05, breakEvenCoverage: 1.5, ebitdaMargin: 0.10 };
    const marginPolicy = DreDecisionPolicyLayer.generatePolicy(marginFacts, DreEconomicScenario.MARGIN_COMPRESSION);

    assert.notStrictEqual(
      breakEvenPolicy.executiveDiagnosis.primaryRecommendation,
      marginPolicy.executiveDiagnosis.primaryRecommendation,
      'Template Leak: Recommendations must be driven by causality, not static scenario templates'
    );
  });
});
