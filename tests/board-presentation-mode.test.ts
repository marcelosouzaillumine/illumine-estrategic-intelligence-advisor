import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BoardPresentationRuntime } from '../src/core/executive-experience/BoardPresentationRuntime';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Phase 10: Board Presentation Runtime Tests', () => {
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
    }
  } as any;

  it('1. Deve iniciar no estágio SUMMARY e permitir transições sequenciais', () => {
    const runtime = new BoardPresentationRuntime(mockReport);
    assert.strictEqual(runtime.getStage(), 'SUMMARY');

    // SUMMARY -> CONTEXT (Valid)
    runtime.transitionTo('CONTEXT');
    assert.strictEqual(runtime.getStage(), 'CONTEXT');

    // CONTEXT -> FINANCIAL_HEALTH (Valid)
    runtime.transitionTo('FINANCIAL_HEALTH');
    assert.strictEqual(runtime.getStage(), 'FINANCIAL_HEALTH');

    // Free backward transition: FINANCIAL_HEALTH -> SUMMARY (Valid)
    runtime.transitionTo('SUMMARY');
    assert.strictEqual(runtime.getStage(), 'SUMMARY');
  });

  it('2. Deve proibir saltos de estágio não-adjacentes para a frente', () => {
    const runtime = new BoardPresentationRuntime(mockReport);
    
    // Attempt jump SUMMARY -> MITIGATION_PLAN (Invalid)
    assert.throws(() => {
      runtime.transitionTo('MITIGATION_PLAN');
    }, /Saltos diretos proibidos/);

    assert.strictEqual(runtime.getStage(), 'SUMMARY');
  });

  it('3. Deve fornecer dados de evidência completos em BOARD_EVIDENCE_MODE', () => {
    const runtime = new BoardPresentationRuntime(mockReport, 'EXP-SNAP-999');
    
    // Toggle evidence mode on
    runtime.enableEvidenceMode(true);
    assert.strictEqual(runtime.isEvidenceModeEnabled(), true);

    const evidence = runtime.getEvidenceData();
    assert.strictEqual(evidence.lineageHash, 'hash-abc');
    assert.strictEqual(evidence.connectorId, 'MANUAL_CSV');
    assert.strictEqual(evidence.confidenceLevel, 'HIGH_CONFIDENCE');
    assert.ok(evidence.warnings.includes('SLOW_EXECUTION'));
    assert.strictEqual(evidence.exportSnapshotReference, 'EXP-SNAP-999');
    assert.strictEqual(evidence.runtimeMetadata.latencyMs, 120);
    assert.strictEqual(evidence.runtimeMetadata.recursionDepth, 2);
  });
});
