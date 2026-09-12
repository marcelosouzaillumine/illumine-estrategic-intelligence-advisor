import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../capabilities/financial/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../capabilities/financial/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

test('DRE Multi-Factor Decision Contract', async (t) => {
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

  await t.test('Should combine at least EBITDA, Net Margin, and Break-Even Coverage in the final diagnosis', () => {
    const policy = DreDecisionPolicyLayer.generatePolicy(baseFacts, DreEconomicScenario.PROFITABLE_SCALE);
    const diagnosis = policy.executiveDiagnosis.currentSituation.toLowerCase();
    
    // Check if the compiled diagnosis uses multi-factors
    const hasEbitdaMention = diagnosis.includes('geração operacional');
    const hasNetMarginMention = diagnosis.includes('margem');
    const hasBreakEvenMention = diagnosis.includes('absorção do ponto de equilíbrio');
    
    assert.ok(hasEbitdaMention, 'Diagnosis must include EBITDA factor evaluation');
    assert.ok(hasNetMarginMention, 'Diagnosis must include Net Margin factor evaluation');
    assert.ok(hasBreakEvenMention, 'Diagnosis must include Break-Even factor evaluation');
  });
});
