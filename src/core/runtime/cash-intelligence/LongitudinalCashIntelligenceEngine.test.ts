// @ts-nocheck
import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { LongitudinalCashIntelligenceEngine } from './LongitudinalCashIntelligenceEngine';
import { CashIntelligenceRuntimeOutput } from './CashIntelligenceTypes';

function createMockCycle(overrides: any = {}): CashIntelligenceRuntimeOutput {
  return {
    isAvailable: true,
    universalIndicators: {
      burnRateOperacional: { value: 0, classification: 'NOT_APPLICABLE' },
      cashRunwayInstitucional: { months: 10, classification: 'HEALTHY' },
      dependenciaDeCapitalizacao: { value: 0 },
      dependenciaFornecedores: { value: 0, alert: 'NORMAL' },
      aprisionamentoCapitalEstoque: { value: 0, alert: 'NORMAL' },
      exposicaoPartesRelacionadas: { value: 0, alert: 'NORMAL' },
      conversaoEbitdaCaixa: { value: 0, alert: 'NORMAL' },
      classificacaoFiduciariaFCF: 'UNSPECIFIED_EXTERNAL_SUPPORT'
    },
    liquidityClassification: {
      classification: 'OPERATIONAL_SUSTAINABLE',
      label: 'Sustentável',
      confidence: 'HIGH',
      severity: 'SAUDÁVEL',
      rationale: ''
    },
    artificialLiquidityDetected: {
      isArtificial: false,
      diagnoses: [],
      liquidityDistortionFactors: [],
      rationale: '',
      blockedConclusions: []
    },
    ...overrides
  } as CashIntelligenceRuntimeOutput;
}

describe('LongitudinalCashIntelligenceEngine', () => {

  it('should return INSUFFICIENT_HISTORICAL_DATA if less than 3 cycles', () => {
    const cycles = [createMockCycle(), createMockCycle()];
    const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);
    assert.equal(result.longitudinalOut.trajectoryClassification, 'INSUFFICIENT_HISTORICAL_DATA');
    assert.equal(result.longitudinalScore, 'NOT_AVAILABLE');
    assert.equal(result.longitudinalOut.recoveryNarrativeBlocked, true);
  });

  it('should return BROKEN status if any cycle is not available', () => {
    const cycles = [createMockCycle(), createMockCycle({ isAvailable: false }), createMockCycle()];
    const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);
    assert.equal(result.timeline.timelineIntegrityStatus, 'BROKEN');
    assert.equal(result.longitudinalOut.trajectoryClassification, 'INSUFFICIENT_HISTORICAL_DATA');
  });

  it('should return REAL_RECOVERY when runway improves over 3 cycles without artificial liquidity', () => {
    const cycles = [
      createMockCycle({ universalIndicators: { cashRunwayInstitucional: { months: 2 } } }), // prevPrev
      createMockCycle({ universalIndicators: { cashRunwayInstitucional: { months: 4 } } }), // prev
      createMockCycle({ universalIndicators: { cashRunwayInstitucional: { months: 6 } } })  // current
    ];
    const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);
    assert.equal(result.longitudinalOut.trajectoryClassification, 'REAL_RECOVERY');
    assert.equal(result.longitudinalScore, 80);
    assert.equal(result.longitudinalOut.recoveryNarrativeBlocked, false);
  });

  it('should return ARTIFICIAL_TURNAROUND when runway improves but driven by artificial liquidity', () => {
    const cycles = [
      createMockCycle({ universalIndicators: { cashRunwayInstitucional: { months: 2 } } }),
      createMockCycle({ universalIndicators: { cashRunwayInstitucional: { months: 4 } } }),
      createMockCycle({ 
        universalIndicators: { cashRunwayInstitucional: { months: 6 } },
        artificialLiquidityDetected: { isArtificial: true }
      })
    ];
    const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);
    assert.equal(result.longitudinalOut.trajectoryClassification, 'ARTIFICIAL_TURNAROUND');
    assert.equal(result.longitudinalScore, 34);
    assert.equal(result.longitudinalOut.recoveryNarrativeBlocked, true);
  });

  it('should return PROGRESSIVE_DETERIORATION when runway drops across cycles', () => {
    const cycles = [
      createMockCycle({ universalIndicators: { cashRunwayInstitucional: { months: 8 } } }),
      createMockCycle({ universalIndicators: { cashRunwayInstitucional: { months: 6 } } }),
      createMockCycle({ universalIndicators: { cashRunwayInstitucional: { months: 4 } } })
    ];
    const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);
    assert.equal(result.longitudinalOut.trajectoryClassification, 'PROGRESSIVE_DETERIORATION');
    assert.equal(result.longitudinalScore, 25);
    assert.equal(result.longitudinalOut.recoveryNarrativeBlocked, true);
  });

  it('should return CHRONIC_DEPENDENCY when >= 50% of cycles show liquidity dependency', () => {
    const cycles = [
      createMockCycle({ liquidityClassification: { classification: 'LIQUIDITY_DEPENDENT' } }),
      createMockCycle({ liquidityClassification: { classification: 'OPERATIONAL_SUSTAINABLE' } }),
      createMockCycle({ liquidityClassification: { classification: 'DEPENDENCIA_DE_CAPITALIZACAO' } })
    ];
    const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);
    assert.equal(result.longitudinalOut.trajectoryClassification, 'CHRONIC_DEPENDENCY');
    assert.equal(result.longitudinalScore, 38); // max 40
    assert.equal(result.longitudinalOut.recoveryNarrativeBlocked, true);
  });

  it('should return STABLE_SUSTAINABILITY for consistent positive metrics', () => {
    const cycles = [
      createMockCycle(), createMockCycle(), createMockCycle() // Mocks are OPERATIONAL_SUSTAINABLE by default
    ];
    const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);
    assert.equal(result.longitudinalOut.trajectoryClassification, 'STABLE_SUSTAINABILITY');
    assert.equal(result.longitudinalScore, 90);
    assert.equal(result.longitudinalOut.recoveryNarrativeBlocked, false);
  });

});
