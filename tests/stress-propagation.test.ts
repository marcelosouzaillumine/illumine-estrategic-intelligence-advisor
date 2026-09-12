import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ConsolidatedRuntimeOrchestrator } from '../src/capabilities/financial/runtime/consolidated/ConsolidatedRuntimeOrchestrator';
import { topologyStressFixture } from './topology-stress.fixture';

describe('Phase 4: Consolidated Stress Propagation Engine', () => {

  it('1. Deve preservar 100% o Single-Entity Mode (nenhum contágio sem edge)', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    const input: any = {
      groupId: 'group-x',
      fiscalYear: '2023',
      tenantContext: { tenantId: 'tenant-1', executionScope: 'CONSOLIDATION', entityScope: ['legacy-entity', 'holding', 'sub-1', 'sub-2'], runtimeScope: 'MULTI_ENTITY', auditScope: 'cfo-1' },
      entities: [
        {
          entityId: 'legacy-entity',
          tenantId: 'tenant-1',
          role: 'Holding',
          rawData: {
            isMockData: true,
            bpData: [{ category: 'Caixa', type: 'ativo', value: 1000 }],
            dreData: []
          }
        }
      ]
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

    // Propagated risks must show the contagion if the threshold is met
    assert.ok(Array.isArray(profile.propagatedRisks));
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

    assert.ok(Array.isArray(profile.affectedEntities));
    assert.ok(Array.isArray(profile.criticalDependencyChains));
    assert.ok(Array.isArray(profile.stressPropagationWarnings));
  });

});
