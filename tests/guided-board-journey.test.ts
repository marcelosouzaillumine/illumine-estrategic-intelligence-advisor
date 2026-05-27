import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GuidedBoardJourneyRuntime } from '../src/core/executive-delivery/GuidedBoardJourneyRuntime';

describe('GuidedBoardJourneyRuntime Navigation Tests', () => {
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

  it('1. Deve iniciar com o primeiro slide e avançar/recuar na ordem correta', () => {
    const journey = new GuidedBoardJourneyRuntime(mockReport);
    let state = journey.getState();

    assert.strictEqual(state.isFullscreenActive, false);
    assert.strictEqual(state.currentStepIndex, 0);

    journey.startJourney();
    state = journey.getState();
    assert.strictEqual(state.isFullscreenActive, true);
    assert.strictEqual(state.currentStepIndex, 0);

    // Go next
    journey.nextStep();
    state = journey.getState();
    assert.strictEqual(state.currentStepIndex, 1);

    // Go prev
    journey.prevStep();
    state = journey.getState();
    assert.strictEqual(state.currentStepIndex, 0);

    // Exit
    journey.exitJourney();
    state = journey.getState();
    assert.strictEqual(state.isFullscreenActive, false);
  });

  it('2. Deve notificar os listeners de mudança de estado', () => {
    const journey = new GuidedBoardJourneyRuntime(mockReport);
    let notifyCount = 0;
    
    const unsubscribe = journey.subscribe(() => {
      notifyCount++;
    });

    journey.startJourney();
    journey.nextStep();
    unsubscribe();
    journey.nextStep(); // should not increment notifyCount

    assert.strictEqual(notifyCount, 2);
  });
});
