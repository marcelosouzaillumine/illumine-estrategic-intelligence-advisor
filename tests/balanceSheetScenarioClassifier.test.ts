import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BalanceSheetScenarioClassifier } from '../src/core/runtime/executive-consolidation/BalanceSheetScenarioClassifier';
import { BalanceSheetExecutiveFacts } from '../src/core/runtime/executive-consolidation/BalanceSheetExecutiveFactsBuilder';

describe('BalanceSheetScenarioClassifier', () => {
  it('should identify CRITICAL_LIQUIDITY_STRESS when liquidity is very low', () => {
    const facts = {
      liquidityImmediate: 0.17,
      liquidityDry: 0.37,
      liquidityCurrent: 1.25
    } as BalanceSheetExecutiveFacts;
    const result = BalanceSheetScenarioClassifier.classify(facts);
    assert.strictEqual(result.scenario, 'CRITICAL_LIQUIDITY_STRESS');
    assert.strictEqual(result.policyProfile, 'SURVIVAL');
  });

  it('should identify EXCESS_LIQUIDITY_OPTIMIZATION when parameters are optimal', () => {
    const facts = {
      liquidityImmediate: 2.5,
      liquidityDry: 3.0,
      liquidityCurrent: 3.5,
      financialAutonomy: 0.75,
      debtRatio: 0.15
    } as BalanceSheetExecutiveFacts;
    const result = BalanceSheetScenarioClassifier.classify(facts);
    assert.strictEqual(result.scenario, 'EXCESS_LIQUIDITY_OPTIMIZATION');
    assert.strictEqual(result.policyProfile, 'CAPITAL_OPTIMIZATION');
  });

  it('should correctly fallback to STRUCTURALLY_BALANCED when no extreme condition is met', () => {
    const facts = {
      liquidityImmediate: 1.0,
      liquidityDry: 1.2,
      liquidityCurrent: 1.3,
      financialAutonomy: 0.6,
      debtRatio: 0.3,
      workingCapital: 100,
      workingCapitalNeed: 0,
      nonCurrentAssets: 0,
      currentAssets: 100
    } as BalanceSheetExecutiveFacts;
    const result = BalanceSheetScenarioClassifier.classify(facts);
    assert.strictEqual(result.scenario, 'STRUCTURALLY_BALANCED');
    assert.strictEqual(result.policyProfile, 'SUSTAINABLE_MANAGEMENT');
  });
});
