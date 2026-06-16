import test from 'node:test';
import assert from 'node:assert';
import { DreSemanticValidator, DRE_SEMANTIC_BLACKLIST } from '../../core/runtime/dre/DreSemanticRegistry';
import { DreDecisionPolicyLayer } from '../../core/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../core/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../core/runtime/dre/DreExecutiveFactsBuilder';

test('DRE CFO Language Normalization Contract', async (t) => {
  await t.test('Should not allow any blacklisted terms in the DRE semantic registry', () => {
    // Asserting the blacklist contains our new terms
    const requiredBlacklist = [
      'caixa livre', 'free cash flow', 'lucro final', 'baseline inviolável',
      'reinvestimento veloz', 'market share', 'war room', 'insolvência iminente',
      'decretar contingência', 'combate ostensivo', 'sangria', 'pivotagem profunda',
      'downsizing imediato', 'queima de caixa estrutural', 'desligamento e liquidação tática',
      'desmontar o custo fixo', 'product-market fit', 'recomeçar limpa', 'burn',
      'janela histórica', 'forçar velocidade', 'baseline', 'bottom-line', 'top-line',
      'unit economics', 'alta tração', 'expansão acelerada', 'espetacular', 'excepcional', 'larga escala'
    ];

    for (const term of requiredBlacklist) {
      assert.ok(
        DRE_SEMANTIC_BLACKLIST.includes(term), 
        `Blacklist is missing mandatory blocked term: ${term}`
      );
    }
  });

  await t.test('DreDecisionPolicyLayer output must be free of semantic leaks across all scenarios', () => {
    const scenarios = [
      DreEconomicScenario.ACCELERATED_VALUE_CREATION,
      DreEconomicScenario.PROFITABLE_SCALE,
      DreEconomicScenario.MARGIN_COMPRESSION,
      DreEconomicScenario.STRUCTURE_ABSORPTION_RISK,
      DreEconomicScenario.ECONOMIC_STRESS,
      DreEconomicScenario.UNCATEGORIZED
    ];

    const mockFacts: DreExecutiveFacts = {
      grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 400,
      contributionMarginValue: 600, contributionMarginRate: 0.6,
      fixedExpenses: 300, ebitda: 300, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0, ebitdaMargin: 0.3,
      netIncome: 200, netMargin: 0.2, breakEvenRevenue: 500,
      breakEvenCoverage: 2.0, breakEvenDistance: 500, safetyMargin: 0.5,
      revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
      operatingResultQuality: 0.66, extraordinaryResultShare: 0,
      fixedCostAbsorption: 3.33, operatingLeverageRisk: 0.3,
      hasMeaningfulHistory: false, historyMessage: null
    };

    for (const scenario of scenarios) {
      const policy = DreDecisionPolicyLayer.generatePolicy(mockFacts, scenario);
      const payloadString = JSON.stringify(policy).toLowerCase();

      for (const term of DRE_SEMANTIC_BLACKLIST) {
        assert.ok(
          !payloadString.includes(term.toLowerCase()),
          `Policy leaked forbidden term '${term}' in scenario ${scenario}`
        );
      }
    }
  });
});
