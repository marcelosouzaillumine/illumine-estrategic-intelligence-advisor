import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../capabilities/financial/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../capabilities/financial/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

test('DRE Negative Margin No Positive Language Contract', async (t) => {
  const baseFacts: DreExecutiveFacts = {
    grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 1400,
    contributionMarginValue: -400, contributionMarginRate: -0.4,
    fixedExpenses: 300, ebitda: -700, grossProfit: -400, grossMargin: -0.4, ebit: -700, ebitMargin: -0.7,
    ebitdaMargin: -0.70, netIncome: -800, netMargin: -0.8, breakEvenRevenue: 0,
    breakEvenCoverage: 0.5, breakEvenDistance: -500, safetyMargin: -0.5,
    revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
    operatingResultQuality: 0, extraordinaryResultShare: 0,
    fixedCostAbsorption: 0, operatingLeverageRisk: 1.0,
    hasMeaningfulHistory: false, historyMessage: null
  };

  await t.test('Negative margin should not output positive language', () => {
    const policy = DreDecisionPolicyLayer.generatePolicy(baseFacts, DreEconomicScenario.ECONOMIC_STRESS);
    const p1Rationale = policy.boardQuestions.p1ValueCreation.rationale;
    
    assert.ok(
      p1Rationale.toLowerCase().includes('déficit') || p1Rationale.toLowerCase().includes('consumo primário'),
      'Rationale must explicitly state critical condition for negative margin.'
    );
    
    const forbiddenTerms = [
      'estabilidade estrutural',
      'folga operacional',
      'eficiência econômica',
      'operação segura',
      'margem preservada',
      'sustenta a leitura de eficiência'
    ];

    for (const term of forbiddenTerms) {
      assert.ok(
        !p1Rationale.toLowerCase().includes(term.toLowerCase()),
        `Rationale must NOT use positive language for negative margin: found "${term}"`
      );
    }
    
    const p3Rationale = policy.boardQuestions.p3EconomicEquilibrium.rationale;
    assert.ok(
      !p3Rationale.toLowerCase().includes('folga operacional'),
      'Rationale must NOT state operational slack when coverage is < 100%.'
    );
  });
});
