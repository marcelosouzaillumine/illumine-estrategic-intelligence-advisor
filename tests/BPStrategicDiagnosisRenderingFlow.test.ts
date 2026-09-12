import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BPStrategicDiagnosisDriverMapper } from '../src/capabilities/runtime/governance/bp/BPStrategicDiagnosisDriverMapper';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../src/workspace/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';
import { ExecutiveDecisionSynthesisEngine } from '../src/services/FiduciaryRuntimeAdapter';

describe('BPStrategicDiagnosisRenderingFlow', () => {

  it('Garante que os drivers mapeados gerem um payload com severidade HEALTHY e ano 2025 (sem texto preso)', () => {
    const selectedYear = 2025;
    
    // 1. Mock the exact visual cards data as provided by the user
    const financialIndicators = [
      { metricName: 'Liquidez Corrente', value: 7.78 },
      { metricName: 'Liquidez Imediata', value: 7.65 },
      { metricName: 'Liquidez Seca', value: 7.99 },
      { metricName: 'Endividamento Geral', value: 7.1 },
      { metricName: 'Autonomia Financeira', value: 92.9 },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.08 }
    ];
    
    // 2. Mock BP Summary
    const bpSummary = {
      patrimonioLiquido: 2175991.66,
    };

    // 3. Map drivers
    const mappedDrivers = BPStrategicDiagnosisDriverMapper.map(financialIndicators, bpSummary);

    // 4. Create isolated context
    const executiveContext: ExecutiveAnalysisContext = {
      analysisYear: selectedYear,
      generatedAt: new Date().toISOString(),
      moduleContext: 'BP',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: 'SAUDÁVEL',
      mathematicalClassification: 'STABLE',
      globalScore: 85,
      primaryIndicators: {},
      technicalDrivers: mappedDrivers,
      contextualAlerts: []
    };

    // 5. Generate payload
    const payload = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(executiveContext);

    // 6. Assertions
    assert.strictEqual(payload.analysisYear, 2025);
    assert.strictEqual(payload.severityState, 'healthy');
    assert.ok(!payload.currentSituation.includes('Dados insuficientes'), 'Não deve exibir texto fixo de dados insuficientes');
    assert.ok(!payload.primaryDriver?.includes('Dados insuficientes'), 'Primary driver não deve exibir falta de dados');
  });
});
