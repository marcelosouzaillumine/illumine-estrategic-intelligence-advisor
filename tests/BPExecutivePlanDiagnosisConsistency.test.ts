import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BPStrategicDiagnosisDriverMapper } from '../src/core/runtime/governance/bp/BPStrategicDiagnosisDriverMapper';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../src/workspace/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';
import { ExecutiveDecisionSynthesisEngine } from '../src/services/FiduciaryRuntimeAdapter';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../src/workspace/runtime/executive-consolidation/ExecutivePrimaryMotiveConsistencyEngine';

describe('BPExecutivePlanDiagnosisConsistency', () => {

  const createScenario = (year: number, indicators: any[], pl: number) => {
    const mappedDrivers = BPStrategicDiagnosisDriverMapper.map(indicators, { patrimonioLiquido: pl });
    const ctx: ExecutiveAnalysisContext = {
      analysisYear: year,
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
    
    const diagnosis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    const planMotive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);

    return { diagnosis, planMotive, opinion };
  };

  it('2025: Autonomia Robusta, Severidade HEALTHY', () => {
    const { diagnosis, planMotive, opinion } = createScenario(2025, [
      { metricName: 'Liquidez Corrente', value: 7.78 },
      { metricName: 'Liquidez Imediata', value: 7.65 },
      { metricName: 'Liquidez Seca', value: 7.99 },
      { metricName: 'Endividamento Geral', value: 7.1 },
      { metricName: 'Autonomia Financeira', value: 92.9 },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.08 }
    ], 2175991.66);

    assert.strictEqual(planMotive.severity, 'HEALTHY');
    assert.strictEqual(diagnosis.severityState, 'healthy');
    assert.strictEqual(planMotive.label, 'Autonomia Financeira Robusta');
  });

  it('2024: Autonomia 82.4, Severidade HEALTHY', () => {
    const { diagnosis, planMotive, opinion } = createScenario(2024, [
      { metricName: 'Liquidez Corrente', value: 4.5 },
      { metricName: 'Liquidez Imediata', value: 4.0 },
      { metricName: 'Liquidez Seca', value: 4.2 },
      { metricName: 'Endividamento Geral', value: 12.0 },
      { metricName: 'Autonomia Financeira', value: 82.4 },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.15 }
    ], 1500000);

    assert.strictEqual(planMotive.severity, 'HEALTHY');
    assert.strictEqual(planMotive.label, 'Autonomia Financeira Robusta');
  });

  it('2023: Autonomia Preservada, Severidade HEALTHY', () => {
    const { diagnosis, planMotive, opinion } = createScenario(2023, [
      { metricName: 'Liquidez Corrente', value: 3.1 },
      { metricName: 'Liquidez Imediata', value: 3.0 },
      { metricName: 'Liquidez Seca', value: 3.0 },
      { metricName: 'Endividamento Geral', value: 25.8 },
      { metricName: 'Autonomia Financeira', value: 74.2 },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.35 }
    ], 1000000);

    assert.strictEqual(planMotive.severity, 'HEALTHY');
    assert.ok(!planMotive.label.includes('Dados Insuficientes'));
    assert.ok(planMotive.label === 'Liquidez Real Confortável' || planMotive.label.includes('Autonomia'));
  });

  it('2022: Liquidez Crítica', () => {
    const { diagnosis, planMotive, opinion } = createScenario(2022, [
      { metricName: 'Liquidez Corrente', value: 0.9 },
      { metricName: 'Liquidez Imediata', value: 0.4 },
      { metricName: 'Liquidez Seca', value: 0.8 },
      { metricName: 'Endividamento Geral', value: 55.0 },
      { metricName: 'Autonomia Financeira', value: 45.0 },
      { metricName: 'Dependência de Capital de Terceiros', value: 1.2 }
    ], 500000);

    assert.strictEqual(planMotive.severity, 'CRITICAL');
    assert.ok(planMotive.label.includes('Liquidez'), `Plan motive label was: ${planMotive.label}`);
    assert.ok(!planMotive.label.includes('Dependência'), 'Should prioritize liquidity over dependency');
  });

});
