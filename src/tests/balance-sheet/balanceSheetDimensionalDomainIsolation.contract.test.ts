import { test, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { FiduciaryRuntimeAdapter } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveDecisionSynthesisEngine } from '../../core/runtime/executive-consolidation/ExecutiveDecisionSynthesisEngine';

test('BalanceSheet Dimensional Domain Isolation: DRE terms cannot leak into BP execution', () => {
  const rawData = {
    clientProfile: { id: 'test', name: 'Test', segmento: 'Geral' },
    rawFinancialData: {
      bpSummary: {
        ativoTotal: 1000,
        passivoTotal: 600,
        patrimonioLiquido: 400
      },
      dreDataLength: 0
    },
    bpData: [{ type: 'Ativo', category: 'Ativo Total', val: 1000 }],
    dreData: [],
    dlpaData: [],
    cashFlowData: [],
    historicalCyclesCount: 1,
    isMockData: false
  };

  const execReport = FiduciaryRuntimeAdapter.generateExecutiveReport(rawData as any);

  // Assert BP uses right terms
  assert.ok(execReport.metrics, 'Report deveria possuir module context seguro de metrics');
  assert.ok(execReport.fiduciaryWarnings, 'Deve conter fiduciary warnings');

  // Test Synthesis Engine explicitly
  const context = {
    analysisYear: 2024,
    generatedAt: new Date().toISOString(),
    moduleContext: 'BP',
    fiduciaryClassification: execReport.canonicalState?.status || '',
    mathematicalClassification: execReport.canonicalState?.status || '',
    globalScore: execReport.scores.composite || 0,
    activeFiduciaryRestrictions: [],
    primaryIndicators: {
      liquidityScore: 50,
      profitabilityScore: 50,
      leverageScore: 50
    },
    technicalDrivers: {},
    contextualAlerts: []
  } as any;

  const payload = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(context);

  assert.ok(!payload.currentSituation.includes('desempenho econômico'), 'BP não pode vazar termo DRE');
  assert.ok(!payload.currentSituation.includes('geração de resultado'), 'BP não pode vazar termo DRE');
});
