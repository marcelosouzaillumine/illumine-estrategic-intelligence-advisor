import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutivePdfExportEngine } from '../src/core/exporting/ExecutivePdfExportEngine';
import { BoardPackExportEngine } from '../src/core/exporting/BoardPackExportEngine';
import { InstitutionalReportFormatter } from '../src/core/exporting/InstitutionalReportFormatter';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Phase 10: PDF & Export Infrastructure Tests', () => {
  const mockReport: any = {
    context: {
      segment: 'Tecnologia',
      businessModel: 'ASSET_LIGHT',
      capitalIntensity: 'Asset Light',
      stage: 'EXPANSION',
      operationalProfile: 'Ciclo curto'
    },
    scores: {
      financial: 85,
      operational: 90,
      governance: 80,
      structural: 75,
      composite: 82.5
    },
    capitalStructure: {
      qualityRating: 'PRIME',
      elasticity: 'HIGH',
      rolloverRisk: 'LOW',
      operationalDependency: 'NONE'
    },
    causality: {
      event: 'Geração robusta de EBITDA',
      rootCause: 'Crescimento de ARR',
      financialPropagation: 'Aumento de caixa circulante',
      absorptionCapacity: 'Excelente capacidade',
      strategicImpact: 'Capex acelerado',
      insights: []
    },
    severity: {
      level: 'SAUDÁVEL',
      justification: 'Zona verde.'
    },
    advisory: {
      executiveSummary: 'Estável e saudável.',
      actionMatrix: ['Alocar caixa', 'Otimizar tributos'],
      priorityFocus: 'Alocação de excesso'
    },
    decomposition: [],
    compliance: {
      runtimeMode: 'FULL_FINANCIAL_VIEW',
      confidenceLevel: 'HIGH_CONFIDENCE',
      dataCompleteness: 1.0,
      causalDepth: 'DEEP',
      narrativeRestrictions: [],
      auditFlags: []
    },
    runtimeMetadata: {
      importId: 'RUN-123',
      connectorId: 'MANUAL_CSV',
      executionTimeMs: 120,
      executionLoopsDetected: false,
      lineage: {
        tenantId: 'TENANT-1',
        workspaceId: 'WS-1',
        connectorId: 'MANUAL_CSV',
        importId: 'RUN-123',
        datasetHash: 'hash-abc',
        sourceHash: 'hash-abc',
        mappingVersion: '1.0',
        timestamp: new Date().toISOString(),
        depth: 2
      },
      performance: {
        warnings: ['SLOW_EXECUTION']
      }
    },
    institutionalEvidence: {
      validationStatus: 'VALIDATED',
      evidenceTrail: []
    }
  } as any;

  it('1. ExecutivePdfExportEngine deve gerar ExportSnapshotMetadata fiduciariamente e retornar jsPDF', () => {
    const reportCopy = JSON.parse(JSON.stringify(mockReport));
    const result = ExecutivePdfExportEngine.exportReport(reportCopy, 'operator-123');

    assert.ok(result.pdf);
    const { metadata } = result;

    assert.ok(metadata.exportId.startsWith('EXP-PDF-'));
    assert.strictEqual(metadata.tenantId, 'TENANT-1');
    assert.strictEqual(metadata.runtimeExecutionId, 'RUN-123');
    assert.strictEqual(metadata.confidenceSnapshot, 'HIGH_CONFIDENCE');
    assert.strictEqual(metadata.lineageHash, 'hash-abc');
    assert.strictEqual(metadata.generatedBy, 'operator-123');

    // Ensure no values were modified
    assert.deepEqual(reportCopy, mockReport);
  });

  it('2. BoardPackExportEngine deve gerar PDF e metadados completos', () => {
    const result = BoardPackExportEngine.exportBoardPack(mockReport, 'board-member-01');
    assert.ok(result.pdf);
    assert.ok(result.metadata.exportId.startsWith('EXP-BPK-'));
    assert.strictEqual(result.metadata.generatedBy, 'board-member-01');
  });

  it('3. InstitutionalReportFormatter deve formatar em Markdown e CSV sem recalcular nada', () => {
    const md = InstitutionalReportFormatter.toMarkdown(mockReport);
    const csv = InstitutionalReportFormatter.toCSV(mockReport);

    // Markdown checks
    assert.ok(md.includes('# RELATÓRIO DE INTELIGÊNCIA EXECUTIVA INSTITUCIONAL'));
    assert.ok(md.includes('Score Composto**: 82.5'));
    assert.ok(md.includes('Geração robusta de EBITDA'));

    // CSV checks
    assert.ok(csv.includes('Métrica,Valor'));
    assert.ok(csv.includes('Composite Score,82.5'));
    assert.ok(csv.includes('Severity Level,SAUDÁVEL'));
    assert.ok(csv.includes('Confidence Level,HIGH_CONFIDENCE'));
  });
});
