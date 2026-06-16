import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../core/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../core/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../core/runtime/dre/DreExecutiveFactsBuilder';

test('DRE No Duplicate Recommendation Contract', async (t) => {
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

  await t.test('Should not have identical recommendations across P1-P7', () => {
    const policy = DreDecisionPolicyLayer.generatePolicy(baseFacts, DreEconomicScenario.PROFITABLE_SCALE);
    const recs = [
      policy.boardQuestions.p1ValueCreation.recommendation,
      policy.boardQuestions.p2StructureSupport.recommendation,
      policy.boardQuestions.p3EconomicEquilibrium.recommendation,
      policy.boardQuestions.p4PrimaryConstraint.recommendation,
      policy.boardQuestions.p5EconomicOpportunity.recommendation,
      policy.boardQuestions.p6InactionRisk.recommendation,
      policy.boardQuestions.p7BoardPriority.recommendation
    ];
    
    const uniqueRecs = new Set(recs);
    assert.strictEqual(uniqueRecs.size, recs.length, 'Duplicate recommendation detected across dimensional panels!');
  });
});
