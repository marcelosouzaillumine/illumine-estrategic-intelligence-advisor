import { test, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetDecisionPolicyLayer } from '../../core/runtime/executive-consolidation/BalanceSheetDecisionPolicyLayer';

test('BalanceSheet Scenario is Output, not Input: Scenarios are derived dynamically', () => {
  const facts = {
    year: 2023,
    totalAssets: 1000,
    currentAssets: 500,
    nonCurrentAssets: 500,
    totalLiabilities: 900,
    currentLiabilities: 600,
    equity: 100,
    liquidityCurrent: 0.5, // CRITICAL
    liquidityImmediate: 0.1,
    liquidityDry: 0.2,
    liquidityGeneral: 0.5,
    workingCapital: -100, // CRITICAL
    workingCapitalNeed: 50,
    treasuryBalance: -150,
    estimatedCashCycle: 45,
    debtRatio: 0.9,
    thirdPartyCapitalDependence: 0.9,
    debtToEquity: 9,
    financialAutonomy: 0.1, // CRITICAL
    debtComposition: 0.8,
    assetConcentrationRisk: 0.5,
    immobilizationOfEquity: 5,
    patrimonialIndex: 0.5,
    growthTotalAssets: 0,
    growthWorkingCapitalNeed: 0,
    growthEquity: 0,
    growthRevenue: 0,
    growthCurrentLiabilities: 0
  };

  const result = BalanceSheetDecisionPolicyLayer.applyPolicies(facts);

  // Derivation test
  assert.strictEqual(result.institutionalScenario.scenario, 'CRITICAL_LIQUIDITY_STRESS', 'Scenario deve ser derivado corretamente como CRITICAL baseado nos facts.');
  
  // The panels must not rely on the scenario string being passed in, but instead derived internally
  assert.ok(result.analysisPanels.protection, 'Painel de proteção deve ser compilado e derivado de facts');
});
