import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BPStrategicDiagnosisDriverMapper } from '../src/core/runtime/governance/bp/BPStrategicDiagnosisDriverMapper';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../src/core/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../src/core/runtime/executive-consolidation/ExecutivePrimaryMotiveConsistencyEngine';

describe('BPStrategicDiagnosisDriverMapper', () => {

  const baseContext: ExecutiveAnalysisContext = {
    analysisYear: 2025,
    generatedAt: new Date().toISOString(),
    moduleContext: 'BP',
    activeFiduciaryRestrictions: [],
    fiduciaryClassification: 'SAUDÁVEL',
    mathematicalClassification: 'STABLE',
    globalScore: 85,
    primaryIndicators: {},
    technicalDrivers: {},
    contextualAlerts: []
  };

  it('O mapper retorna todas as chaves exigidas e garante fallback zero seguro (sem strings/undefined)', () => {
    const financialIndicators = [
      { metricName: 'Liquidez Corrente', value: "7.78" },
      { metricName: 'Liquidez Seca', value: "7.99" },
      { metricName: 'Liquidez Imediata', value: 0 },
      { metricName: 'Endividamento Geral', value: 0 },
      { metricName: 'Autonomia Financeira', value: "92.9" },
      { metricName: 'Dependência de Capital de Terceiros', value: 0 }
    ];
    
    const dirtyBpSummary = {
      liquidezSeca: 7.99,
      endividamentoGeral: 0,
      autonomiaFinanceira: "92.9",
      patrimonioLiquido: 2175991.66,
      dependenciaCapitalTerceiros: 0
    };

    const mapped = BPStrategicDiagnosisDriverMapper.map(financialIndicators, dirtyBpSummary);

    assert.strictEqual(mapped.liquidezReal, 7.78);
    assert.strictEqual(mapped.liquidezSeca, 7.99);
    assert.strictEqual(mapped.liquidezInstantaneaReal, 0);
    assert.strictEqual(mapped.endividamentoGeral, 0);
    assert.strictEqual(mapped.autonomiaFinanceira, 92.9);
    assert.strictEqual(mapped.patrimonioLiquido, 2175991.66);
    assert.strictEqual(mapped.dependenciaCapitalTerceiros, 0);
  });

  it('Um payload BP 2025 completo não cai em NEUTRAL', () => {
    const financialIndicators = [
      { metricName: 'Liquidez Corrente', value: 7.78 },
      { metricName: 'Liquidez Imediata', value: 7.65 },
      { metricName: 'Liquidez Seca', value: 7.99 },
      { metricName: 'Endividamento Geral', value: 7.1 },
      { metricName: 'Autonomia Financeira', value: 92.9 },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.08 }
    ];
    
    const bpSummary = {
      liquidezSeca: 7.99,
      endividamentoGeral: 7.1,
      autonomiaFinanceira: 92.9,
      patrimonioLiquido: 2175991.66,
      dependenciaCapitalTerceiros: 0.08
    };

    const technicalDrivers = BPStrategicDiagnosisDriverMapper.map(financialIndicators, bpSummary);

    const ctx = {
      ...baseContext,
      technicalDrivers
    };
    
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    assert.notStrictEqual(motive.severity, 'NEUTRAL');
    assert.ok(motive.severity === 'HEALTHY');
  });

  it('Um payload BP 2022 com liquidez real inferior a 1 cai em CRITICAL', () => {
    const financialIndicators = [
      { metricName: 'Liquidez Corrente', value: 0.9 },
      { metricName: 'Liquidez Imediata', value: 0.5 },
      { metricName: 'Liquidez Seca', value: 0.6 },
      { metricName: 'Endividamento Geral', value: 50.0 },
      { metricName: 'Autonomia Financeira', value: 50.0 },
      { metricName: 'Dependência de Capital de Terceiros', value: 50.0 }
    ];
    
    const bpSummary = {
      liquidezSeca: 0.6,
      endividamentoGeral: 50.0,
      autonomiaFinanceira: 50.0,
      patrimonioLiquido: 1000000,
      dependenciaCapitalTerceiros: 50.0
    };

    const technicalDrivers = BPStrategicDiagnosisDriverMapper.map(financialIndicators, bpSummary);

    const ctx = {
      ...baseContext,
      technicalDrivers
    };
    
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    assert.strictEqual(motive.severity, 'CRITICAL');
  });

});
