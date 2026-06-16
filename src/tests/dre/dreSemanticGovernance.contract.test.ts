import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DreDecisionPolicyLayer } from '../../core/runtime/dre/DreDecisionPolicyLayer';
import { DreEconomicScenario } from '../../core/runtime/dre/DreScenarioClassifier';

test('dreSemanticGovernance: Nenhuma política deve conter jargões inadequados (Semantic Registry)', () => {
  const facts: any = { ebitdaMargin: 0.5, hasMeaningfulHistory: true, ebitda: 1000, grossProfit: 2000, breakEvenCoverage: 1.5 };
  
  const scenarios = Object.values(DreEconomicScenario);
  
  for (const sc of scenarios) {
    const policy = DreDecisionPolicyLayer.generatePolicy(facts, sc);
    const textToCheck = JSON.stringify(policy).toLowerCase();
    
    assert.ok(!textToCheck.includes('agressiva'));
    assert.ok(!textToCheck.includes('dominar mercado'));
    assert.ok(!textToCheck.includes('forçar velocidade'));
    assert.ok(!textToCheck.includes('capitalizar a qualquer custo'));
    assert.ok(!textToCheck.includes('captura indiscriminada'));
    assert.ok(!textToCheck.includes('capturar'));
  }
});
