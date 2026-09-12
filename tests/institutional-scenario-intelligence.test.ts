// tests/institutional-scenario-intelligence.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalScenarioEngine } from '../src/capabilities/runtime/scenario-intelligence/InstitutionalScenarioEngine';
import { ScenarioInput } from '../src/capabilities/runtime/scenario-intelligence/scenario-types';

describe('RC-1.6 - Institutional Scenario Governance', () => {

  const baseContext = { netIncome: 1000, availableCash: 5000, fundingInflows: 0 };

  it('Deve bloquear simulações que excedam limites fiduciários (Fail-Closed)', () => {
    const inputs: ScenarioInput[] = [{ variable: 'INVENTORY_VOLUME', variationPercentage: 150 }];
    const result = InstitutionalScenarioEngine.evaluateScenario(inputs, baseContext);
    
    assert.equal(result.validation.status, 'BLOCKED_BY_EXTRAPOLATION');
    assert.ok(!result.propagationProfile); // Não propaga
  });

  it('Deve bloquear hipercrescimento de receita sem base de funding/caixa', () => {
    const inputs: ScenarioInput[] = [{ variable: 'REVENUE_VOLUME', variationPercentage: 25 }];
    const contextSemCaixa = { netIncome: -100, availableCash: 0, fundingInflows: 0 };
    const result = InstitutionalScenarioEngine.evaluateScenario(inputs, contextSemCaixa);
    
    assert.equal(result.validation.status, 'BLOCKED_BY_ECONOMIC_LAW');
  });

  it('Deve gerar propagação estrutural e hashes de lineage para cenários válidos', () => {
    const inputs: ScenarioInput[] = [{ variable: 'INVENTORY_VOLUME', variationPercentage: 30 }];
    const result = InstitutionalScenarioEngine.evaluateScenario(inputs, baseContext);
    
    assert.equal(result.validation.status, 'VALID');
    assert.ok(result.propagationProfile);
    assert.ok(result.propagationProfile.edges.length > 0);
    
    // Hashes exist and lineage is composed
    assert.ok(result.explainability);
    assert.ok(result.explainability.lineageHash);
    assert.ok(result.explainability.baselineHash);
  });

  it('Aumento de estoque propaga corretamente para DFC e causa tensão negativa', () => {
    const inputs: ScenarioInput[] = [{ variable: 'INVENTORY_VOLUME', variationPercentage: 25 }];
    const result = InstitutionalScenarioEngine.evaluateScenario(inputs, baseContext);
    
    const propagation = result.propagationProfile!;
    const edgeToDFC = propagation.edges.find(e => e.target.dimension === 'DFC' && e.target.metric === 'Caixa Operacional');
    
    assert.ok(edgeToDFC);
    assert.equal(edgeToDFC.target.impactDirection, 'NEGATIVE');
  });

});
