import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ConsolidatedRuntimeOrchestrator } from '../src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator';
import { topologyStressFixture } from './topology-stress.fixture';

describe('Phase 4: Consolidated Stress Propagation Engine', () => {

  it('1. Deve preservar 100% o Single-Entity Mode (nenhum contágio sem edge)', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    const input = {
      isMockData: true,
      bpData: [{ category: 'Caixa', type: 'ativo', value: 1000 }],
      dreData: []
    };
    
    const report = orchestrator.runConsolidatedAnalysis(input);
    assert.equal(report.systemicRiskProfile, undefined);
  });

  it('2. Deve propagar Ruptura de Caixa e Dependência de Funding (Holding afundada pela SubDependent)', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    
    const fixture = JSON.parse(JSON.stringify(topologyStressFixture));
    const report = orchestrator.runConsolidatedAnalysis(fixture);

    assert.ok(report.systemicRiskProfile);
    const profile = report.systemicRiskProfile!;

    // Base edges must contain Mutuos and Guarantees
    assert.ok(profile.systemicStressMap.length >= 2, 'Deve ter arestas de Mutuo e Guarantia');

    // Propagated risks must show the contagion
    assert.ok(profile.propagatedRisks.length > 0, 'Deve haver contágio ativo');

    // A Holding deve ter sido afetada pela SubDependent
    const contagionToHolding = profile.propagatedRisks.find(c => c.targetEntity === 'Holding');
    assert.ok(contagionToHolding, 'Holding deve sofrer contágio');
    assert.equal(contagionToHolding.sourceEntity, 'SubDependent');
    
    // Lineage preservado
    assert.ok(contagionToHolding.lineage.includes('CONTÁGIO ATIVADO'));
  });

  it('3. Deve bloquear Falso Contágio para a Entidade Saudável (SubHealthy)', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    
    const fixture = JSON.parse(JSON.stringify(topologyStressFixture));
    const report = orchestrator.runConsolidatedAnalysis(fixture);

    const profile = report.systemicRiskProfile!;

    // A SubHealthy não pode estar nos propagatedRisks sofrendo contágio da SubDependent ou da Holding
    // (a menos que criássemos uma dependência explícita)
    const contagionToHealthy = profile.propagatedRisks.find(c => c.targetEntity === 'SubHealthy');
    assert.equal(contagionToHealthy, undefined, 'A entidade saudável NÃO deve ser contagiada sem edge real');
  });

  it('4. Deve agregar o risco e gerar criticalDependencyChains e Warnings corretamente', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    
    const fixture = JSON.parse(JSON.stringify(topologyStressFixture));
    const report = orchestrator.runConsolidatedAnalysis(fixture);

    const profile = report.systemicRiskProfile!;

    assert.ok(profile.affectedEntities.includes('Holding'));
    assert.ok(Array.isArray(profile.criticalDependencyChains));
    assert.ok(Array.isArray(profile.stressPropagationWarnings));
  });

});
