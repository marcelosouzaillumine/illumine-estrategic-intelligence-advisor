import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveDeliveryOrchestrator } from '../src/core/executive-delivery/ExecutiveDeliveryOrchestrator';

describe('ExecutiveDeliveryOrchestrator Tests', () => {
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

  it('1. Deve retornar os passos na ordem exata e com os dados corretos associados', () => {
    const steps = ExecutiveDeliveryOrchestrator.orchestrate(mockReport);
    assert.strictEqual(steps.length, 9);
    assert.strictEqual(steps[0].step, 'SUMMARY');
    assert.strictEqual(steps[1].step, 'PRIORITIES');
    assert.strictEqual(steps[2].step, 'FINANCIAL_HEALTH');
    assert.strictEqual(steps[3].step, 'CAUSALITY');
    assert.strictEqual(steps[4].step, 'STRESS_PROPAGATION');
    assert.strictEqual(steps[5].step, 'SCENARIOS');
    assert.strictEqual(steps[6].step, 'RISKS');
    assert.strictEqual(steps[7].step, 'ACTION_FOCUS');
    assert.strictEqual(steps[8].step, 'BOARD_CONCLUSION');

    // Check passive data grouping (no recalculations)
    assert.strictEqual(steps[0].data.severity.level, 'SAUDÁVEL');
    assert.strictEqual(steps[2].data.scores.composite, 82.5);
    assert.strictEqual(steps[3].data.causality.event, 'Geração robusta de EBITDA');
  });

  it('2. Deve lançar erro se o relatório for nulo ou inválido', () => {
    assert.throws(() => {
      ExecutiveDeliveryOrchestrator.orchestrate(null as any);
    });
  });
});
