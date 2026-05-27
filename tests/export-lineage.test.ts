import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BoardPackExportEngine } from '../src/core/exporting/BoardPackExportEngine';

describe('Export Lineage & Metadata Verification Tests', () => {
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

  it('1. BoardPackExportEngine deve preservar lineage fiduciariamente sem recalcular nada', () => {
    const reportCopy = JSON.parse(JSON.stringify(mockReport));
    const result = BoardPackExportEngine.exportBoardPack(reportCopy, 'operator-999');

    assert.ok(result.pdf);
    const { metadata } = result;

    assert.ok(metadata.exportId.startsWith('EXP-BPK-'));
    assert.strictEqual(metadata.tenantId, 'TENANT-1');
    assert.strictEqual(metadata.runtimeExecutionId, 'RUN-123');
    assert.strictEqual(metadata.confidenceSnapshot, 'HIGH_CONFIDENCE');
    assert.strictEqual(metadata.lineageHash, 'hash-abc');
    assert.strictEqual(metadata.generatedBy, 'operator-999');

    // Double check that original report was not mutated
    assert.deepEqual(reportCopy, mockReport);
  });
});
