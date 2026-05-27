import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveSummaryComposer } from '../src/core/executive-experience/ExecutiveSummaryComposer';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Phase 10: Executive Summary Composer Tests', () => {
  const mockReport: any = {
    context: {
      segment: 'Serviços Financeiros',
      businessModel: 'ASSET_LIGHT',
      capitalIntensity: 'Asset Light',
      stage: 'EXPANSION',
      operationalProfile: 'Ciclo curto'
    },
    scores: {
      financial: 90,
      operational: 85,
      governance: 95,
      structural: 80,
      composite: 88.0
    },
    capitalStructure: {
      qualityRating: 'PRIME',
      elasticity: 'HIGH',
      rolloverRisk: 'LOW',
      operationalDependency: 'NONE'
    },
    causality: {
      event: 'Crescimento de margem operacional',
      rootCause: 'Otimização de custos administrativos',
      financialPropagation: 'Aumento do fluxo de caixa operacional',
      absorptionCapacity: 'Alta capacidade',
      strategicImpact: 'Mitiga necessidade de capital de giro de terceiros',
      insights: []
    },
    severity: {
      level: 'SAUDÁVEL',
      justification: 'Todos os indicadores em patamares excelentes.'
    },
    advisory: {
      executiveSummary: 'Operação robusta e eficiente.',
      actionMatrix: ['Manter controle de Capex', 'Estruturar reserva'],
      priorityFocus: 'Reserva de liquidez'
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
      importId: 'RUN-555',
      connectorId: 'MANUAL_CSV',
      executionTimeMs: 95,
      executionLoopsDetected: false,
      lineage: {
        tenantId: 'TENANT-1',
        workspaceId: 'WS-1',
        connectorId: 'MANUAL_CSV',
        importId: 'RUN-555',
        datasetHash: 'hash-xyz',
        sourceHash: 'hash-xyz',
        mappingVersion: '1.0',
        timestamp: new Date().toISOString(),
        depth: 1
      },
      performance: {
        warnings: ['LATENCY_Nominal']
      }
    }
  } as any;

  it('1. Deve gerar resumos com as chaves corretas e coerentes', () => {
    const summary = ExecutiveSummaryComposer.compose(mockReport, 'CEO');
    
    assert.strictEqual(summary.role, 'CEO');
    assert.ok(summary.focusTitle.includes('Alocação Estratégica'));
    assert.strictEqual(summary.keyMetricHighlight, 'Score Composto: 88/100');
    assert.ok(summary.narrativeSummary.includes('SAUDÁVEL'));
    assert.strictEqual(summary.alertCount, 1);
  });

  it('2. Deve mudar foco e narrativa para cada persona (Board, Investor, Advisor, Operational)', () => {
    const board = ExecutiveSummaryComposer.compose(mockReport, 'BOARD');
    const investor = ExecutiveSummaryComposer.compose(mockReport, 'INVESTOR');
    const advisor = ExecutiveSummaryComposer.compose(mockReport, 'ADVISOR');
    const operational = ExecutiveSummaryComposer.compose(mockReport, 'OPERATIONAL');

    assert.strictEqual(board.role, 'BOARD');
    assert.ok(board.focusTitle.includes('Governança Fiduciária'));
    assert.ok(board.narrativeSummary.includes('HIGH_CONFIDENCE'));

    assert.strictEqual(investor.role, 'INVESTOR');
    assert.ok(investor.focusTitle.includes('Retorno sobre Capital'));
    assert.ok(investor.narrativeSummary.includes('Serviços Financeiros'));

    assert.strictEqual(advisor.role, 'ADVISOR');
    assert.ok(advisor.focusTitle.includes('Diagnóstico Contábil'));
    assert.ok(advisor.narrativeSummary.includes('Crescimento de margem operacional'));

    assert.strictEqual(operational.role, 'OPERATIONAL');
    assert.ok(operational.focusTitle.includes('Ciclo Financeiro'));
    assert.ok(operational.narrativeSummary.includes('Reserva de liquidez'));
  });
});
