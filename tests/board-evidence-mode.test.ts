import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GuidedBoardJourneyRuntime } from '../src/core/executive-delivery/GuidedBoardJourneyRuntime';

describe('BOARD_EVIDENCE_MODE Integration Tests', () => {
  const mockReport: any = {
    context: { segment: 'Tecnologia', businessModel: 'SaaS', capitalIntensity: 'Asset Light', stage: 'EXPANSION', operationalProfile: 'Ciclo curto' },
    scores: { financial: 85, operational: 90, governance: 80, structural: 75, composite: 82.5 },
    capitalStructure: { qualityRating: 'PRIME', elasticity: 'HIGH', rolloverRisk: 'LOW', operationalDependency: 'NONE' },
    causality: { event: 'Geração robusta de EBITDA', rootCause: 'Crescimento de ARR', financialPropagation: 'Aumento de caixa circulante', absorptionCapacity: 'Excelente capacidade', strategicImpact: 'Capex acelerado', insights: [] },
    severity: { level: 'SAUDÁVEL', justification: 'Zona verde.' },
    advisory: { executiveSummary: 'Estável e saudável.', actionMatrix: ['Alocar caixa', 'Otimizar tributos'], priorityFocus: 'Alocação de excesso' },
    decomposition: [],
    metrics: { hasData: true, financialMetrics: {}, kpis: [], efficiencies: [], scaleEfficiency: {}, alerts: [], chartData: [] },
    compliance: { runtimeMode: 'FULL_FINANCIAL_VIEW', confidenceLevel: 'HIGH_CONFIDENCE', dataCompleteness: 1.0, causalDepth: 'DEEP', narrativeRestrictions: ['Restrict 1'], auditFlags: ['Flag A'] },
    runtimeMetadata: { importId: 'RUN-123', connectorId: 'MANUAL_CSV', executionTimeMs: 120, executionLoopsDetected: false, calibrationProfileId: 'conservative', engineVersion: 'v1.0.4', lineage: { tenantId: 'TENANT-1', workspaceId: 'WS-1', connectorId: 'MANUAL_CSV', importId: 'RUN-123', datasetHash: 'hash-abc', sourceHash: 'hash-abc', mappingVersion: '1.0', timestamp: new Date().toISOString(), depth: 2 }, performance: { warnings: [] } }
  };

  it('1. Deve extrair de forma estritamente passiva e completa os dados fiduciários da evidência', () => {
    const reportCopy = JSON.parse(JSON.stringify(mockReport));
    const journey = new GuidedBoardJourneyRuntime(reportCopy);
    const evidence = journey.getBoardEvidence();

    assert.strictEqual(evidence.datasetHash, 'hash-abc');
    assert.strictEqual(evidence.tenantId, 'TENANT-1');
    assert.strictEqual(evidence.executionId, 'RUN-123');
    assert.strictEqual(evidence.calibrationProfile, 'conservative');
    assert.strictEqual(evidence.confidenceLevel, 'HIGH_CONFIDENCE');
    assert.strictEqual(evidence.dataCompleteness, 1.0);
    assert.deepEqual(evidence.auditFlags, ['Flag A']);
    assert.deepEqual(evidence.narrativeRestrictions, ['Restrict 1']);
    assert.strictEqual(evidence.reportVersion, 'v1.0.4');

    // Confirm absolutely no mutations were made on original report object
    assert.deepEqual(reportCopy, mockReport);
  });
});
