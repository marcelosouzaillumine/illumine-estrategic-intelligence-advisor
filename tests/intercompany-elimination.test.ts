import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ConsolidatedRuntimeOrchestrator } from '../src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator';
import { topologyIntercompanyFixture } from './topology-intercompany.fixture';

describe('Phase 3: Intercompany Elimination Engine', () => {

  it('1. Deve executar o Single-Entity Mode de forma intacta', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    const input = {
      isMockData: true,
      bpData: [{ category: 'Caixa', type: 'ativo', value: 1000 }],
      dreData: []
    };
    
    const report = orchestrator.runConsolidatedAnalysis(input);
    assert.equal(report.eliminatedEntries, undefined);
  });

  it('2. Deve detectar Mútuo Exato e Receita/Despesa Exata, aplicando Eliminação', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    
    // Clonamos para nao sujar
    const fixture = JSON.parse(JSON.stringify(topologyIntercompanyFixture));
    
    const report = orchestrator.runConsolidatedAnalysis(fixture);

    // Deve ter match entre:
    // Holding (Mutuo a receber 500) <-> Sub-A (Mutuo a pagar 500)
    // Holding (Taxa Franquia 100) <-> Sub-A (Despesa Franquia 100)
    assert.ok(report.eliminatedEntries);
    assert.equal(report.eliminatedEntries!.length, 2, 'Deveria eliminar 2 operacoes exatas');

    // Mútuo a pagar de Sub-B (200) nao tem contraparte na Holding no fixture
    assert.ok(report.unreconciledIntercompany);
    assert.equal(report.unreconciledIntercompany!.length, 1, 'Sub-B mutuo deve estar unreconciled');
    
    // O status de confidence deve refletir UNRECONCILED por causa da Sub-B
    assert.equal(report.eliminationConfidence, 'UNRECONCILED');
  });

  it('3. Deve emitir LOW_CONFIDENCE_MATCH e warning para discrepância material (ex: 5%)', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    
    const input = {
      groupId: 'GRP-WARN',
      tenantContext: { tenantId: 'tenant-1', executionScope: 'CONSOLIDATION', entityScope: ['Hold', 'Sub1'], runtimeScope: 'MULTI_ENTITY', auditScope: 'test' },
      entities: [
        {
          entityId: 'Hold',
          role: 'Holding' as const,
          rawData: {
            bpData: [{ category: 'Mútuo a Receber', type: 'ativo', value: 1000 }],
            dreData: []
          }
        },
        {
          entityId: 'Sub1',
          role: 'Subsidiary' as const,
          rawData: {
            bpData: [{ category: 'Mútuo a Pagar', type: 'passivo', value: 1050 }],
            dreData: []
          }
        }
      ]
    };

    const report = orchestrator.runConsolidatedAnalysis(input);
    
    assert.ok(report.unreconciledIntercompany);
    assert.equal(report.unreconciledIntercompany!.length, 1, 'Tratado como unreconciled temporariamente');
    assert.ok(report.eliminationWarnings);
    assert.equal(report.eliminationWarnings!.length, 1);
    assert.ok(report.eliminationWarnings![0].message.includes('LOW_CONFIDENCE'));
  });

});
