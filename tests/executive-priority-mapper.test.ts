import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutivePriorityMapper } from '../src/core/executive-delivery/ExecutivePriorityMapper';

describe('ExecutivePriorityMapper Tests', () => {
  const mockReport: any = {
    context: { segment: 'Tecnologia', businessModel: 'SaaS', capitalIntensity: 'Asset Light', stage: 'EXPANSION', operationalProfile: 'Ciclo curto' },
    scores: { financial: 85, operational: 90, governance: 80, structural: 75, composite: 82.5 },
    capitalStructure: { qualityRating: 'PRIME', elasticity: 'HIGH', rolloverRisk: 'LOW', operationalDependency: 'NONE' },
    causality: { event: 'Geração robusta de EBITDA', rootCause: 'Crescimento de ARR', financialPropagation: 'Aumento de caixa circulante', absorptionCapacity: 'Excelente capacidade', strategicImpact: 'Capex acelerado', insights: [] },
    severity: { level: 'SAUDÁVEL', justification: 'Zona verde.' },
    advisory: { executiveSummary: 'Estável e saudável.', actionMatrix: ['Alocar caixa', 'Otimizar tributos'], priorityFocus: 'Alocação de excesso' },
    decomposition: [],
    metrics: { hasData: true, financialMetrics: {}, kpis: [], efficiencies: [], scaleEfficiency: {}, alerts: [], chartData: [] },
    compliance: { runtimeMode: 'FULL_FINANCIAL_VIEW', confidenceLevel: 'HIGH_CONFIDENCE', dataCompleteness: 1.0, causalDepth: 'DEEP', narrativeRestrictions: [], auditFlags: [] },
    runtimeMetadata: { importId: 'RUN-123', connectorId: 'MANUAL_CSV', executionTimeMs: 120, executionLoopsDetected: false, lineage: { tenantId: 'TENANT-1', workspaceId: 'WS-1', connectorId: 'MANUAL_CSV', importId: 'RUN-123', datasetHash: 'hash-abc', sourceHash: 'hash-abc', mappingVersion: '1.0', timestamp: new Date().toISOString(), depth: 2 }, performance: { warnings: [] } }
  };

  it('1. Deve retornar INSUFFICIENT_PRIORITY_DATA se os campos de sequenciamento dinâmico estiverem ausentes', () => {
    const reportCopy = JSON.parse(JSON.stringify(mockReport));
    const result = ExecutivePriorityMapper.map(reportCopy);

    assert.strictEqual(result.status, 'INSUFFICIENT_PRIORITY_DATA');
    assert.strictEqual(result.priorities.length, 2);
    // Preserves original order from actionMatrix
    assert.strictEqual(result.priorities[0].description, 'Alocar caixa');
    assert.strictEqual(result.priorities[1].description, 'Otimizar tributos');
  });

  it('2. Deve mapear com sucesso se o runtime trouxer explicitamente priorityRank e recommendedFocusAreas', () => {
    const reportCopyWithPriorities = {
      ...mockReport,
      recommendedFocusAreas: [
        { id: '1', title: 'Prioridade A', description: 'Reduzir custos fixos', priorityRank: 2 },
        { id: '2', title: 'Prioridade B', description: 'Aportar capital de giro', priorityRank: 1 }
      ]
    };

    const result = ExecutivePriorityMapper.map(reportCopyWithPriorities);

    assert.strictEqual(result.status, 'SUCCESS');
    assert.strictEqual(result.priorities.length, 2);
    // Must sort by priorityRank passivamente (1 comes before 2)
    assert.strictEqual(result.priorities[0].id, '2');
    assert.strictEqual(result.priorities[0].description, 'Aportar capital de giro');
    assert.strictEqual(result.priorities[1].id, '1');
    assert.strictEqual(result.priorities[1].description, 'Reduzir custos fixos');
  });
});
