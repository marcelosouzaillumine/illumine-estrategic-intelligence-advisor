import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ConsolidatedRuntimeOrchestrator } from '../src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator';

describe('ConsolidatedRuntimeOrchestrator - Phase 2', () => {

  it('1. Deve executar em modo pass-through (Single-Entity Fallback) quando array estiver vazio ou ausente', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    
    const legacyInput = {
      isMockData: true,
      bpData: [{ category: 'Caixa', type: 'ativo', value: 500 }],
      dreData: []
    };

    const report = orchestrator.runConsolidatedAnalysis(legacyInput);
    
    // Comportamento original
    assert.equal(report.groupId, undefined);
    assert.notEqual(report.severity, undefined);
  });

  it('2. Deve executar em modo pass-through se houver apenas 1 entidade na topologia', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    
    const multiEntityInput = {
      groupId: 'GRP-123',
      entities: [
        {
          entityId: 'EntA',
          role: 'Holding' as const,
          rawData: {
            isMockData: true,
            bpData: [{ category: 'Caixa', type: 'ativo', value: 500 }],
            dreData: []
          }
        }
      ]
    };

    const report = orchestrator.runConsolidatedAnalysis(multiEntityInput);
    
    // Como é 1 entidade, atua como pass-through
    assert.equal(report.groupId, undefined); 
  });

  it('3. Multi-Entity Execution: Deve processar N entidades e retornar o ConsolidatedReport', () => {
    const orchestrator = new ConsolidatedRuntimeOrchestrator();
    
    const multiEntityInput = {
      groupId: 'GRP-MULTI',
      entities: [
        {
          entityId: 'FilialA',
          role: 'Subsidiary' as const,
          rawData: { isMockData: true, bpData: [], dreData: [] } // Fake
        },
        {
          entityId: 'HoldingX',
          role: 'Holding' as const,
          rawData: { isMockData: true, bpData: [], dreData: [] } // Fake
        }
      ]
    };

    const report = orchestrator.runConsolidatedAnalysis(multiEntityInput);
    
    // Assert Group Id foi injetado pelo assembler
    assert.equal(report.groupId, 'GRP-MULTI');
    
    // Assert Confidence Degradation foi aplicada
    assert.notEqual(report.confidenceByEntity, undefined);
    
    // Assert Eliminated Values Warning (Array vazio com aviso)
    assert.notEqual(report.eliminatedValues, undefined);
    assert.equal(report.eliminatedValues!.length, 0);

    // Assert Severity foi consolidada
    assert.ok(report.severity.justification.includes('[CONSOLIDATED VIEW]'));
  });

});
