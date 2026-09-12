import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer } from '../../capabilities/financial/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../capabilities/financial/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

test('DRE Borderline Year 2023 Contract', async (t) => {
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

  await t.test('2023 should use borderline recovery language', () => {
    // 2023 facts, even if numbers are good, the year specific override applies
    const facts2023 = { ...baseFacts, netMargin: 0.02, breakEvenCoverage: 1.1 };
    const policy2023 = DreDecisionPolicyLayer.generatePolicy(facts2023, DreEconomicScenario.STRUCTURE_ABSORPTION_RISK, 2023);
    
    const diag = policy2023.executiveDiagnosis.currentSituation.toLowerCase();
    
    // Should NOT include
    assert.ok(!diag.includes('robusta') && !diag.includes('robusto'), '2023 must not be described as robusto');
    assert.ok(!diag.includes(' segura ') && !diag.includes('segurança ampla'), '2023 must not be described as segura');
    assert.ok(!diag.includes('oportunidade'), '2023 must not be described as oportunidade');
    assert.ok(!diag.includes('saudável'), '2023 must not be described as saudável');
    assert.ok(!diag.includes('escalável'), '2023 must not be described as escalável');
    assert.ok(!diag.includes('alta estabilidade'), '2023 must not be described as alta estabilidade');

    // Should INCLUDE
    assert.ok(diag.includes('viabilidade em patamar crítico'), '2023 must use "viabilidade em patamar crítico"');
    assert.ok(diag.includes('contenção estrita'), '2023 must mention "contenção estrita"');
  });

  await t.test('2024 and 2025 should have different diagnosis', () => {
    const policy2024 = DreDecisionPolicyLayer.generatePolicy(baseFacts, DreEconomicScenario.PROFITABLE_SCALE, 2024);
    const policy2025 = DreDecisionPolicyLayer.generatePolicy(baseFacts, DreEconomicScenario.PROFITABLE_SCALE, 2025);
    
    const diag24 = policy2024.executiveDiagnosis.currentSituation;
    const diag25 = policy2025.executiveDiagnosis.currentSituation;
    
    assert.notStrictEqual(diag24, diag25, '2024 and 2025 should have different diagnosis');
    assert.ok(diag24.includes('salto consistente'), '2024 must include salto consistente');
    assert.ok(diag25.includes('manutenção de margem elevada'), '2025 must include manutenção');
  });
});
