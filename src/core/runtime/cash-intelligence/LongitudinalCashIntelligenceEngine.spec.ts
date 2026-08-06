import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { LongitudinalCashIntelligenceEngine } from './LongitudinalCashIntelligenceEngine';
import { CashIntelligenceRuntimeOutput } from './CashIntelligenceTypes';

// Helper mock para não ter que criar o output inteiro
const createMockOutput = (
  runway: number,
  fcoPositive: boolean,
  classification: string,
  reconciliationStatus: 'RECONCILED' | 'BLOCKED' = 'RECONCILED'
): CashIntelligenceRuntimeOutput => {
  return {
    isAvailable: true,
    universalIndicators: {
      burnRateOperacional: { value: fcoPositive ? -100 : 100, classification: 'NOT_APPLICABLE' },
      cashRunwayInstitucional: { months: runway, classification: 'HEALTHY' },
      dependenciaDeCapitalizacao: { value: 0 },
      dependenciaFornecedores: { value: 0, alert: 'NORMAL' },
      aprisionamentoCapitalEstoque: { value: 0, alert: 'NORMAL' },
      exposicaoPartesRelacionadas: { value: 0, alert: 'NORMAL' },
      conversaoEbitdaCaixa: { value: 0, alert: 'NORMAL' },
      classificacaoFiduciariaFCF: 'UNSPECIFIED_EXTERNAL_SUPPORT'
    },
    liquidityClassification: {
      classification: classification as any,
      label: '', confidence: 'HIGH', severity: 'SAUDÁVEL', rationale: ''
    },
    artificialLiquidityDetected: { isArtificial: false, diagnoses: [], liquidityDistortionFactors: [], rationale: '', blockedConclusions: [] },
    reconciliationAlerts: { isReconcilable: true, variancePercentage: 0, confidence: 'HIGH', reconciliationStatus, temporalSeverity: 'LOW', alerts: [], disclosures: [], restrictsOptimisticInterpretations: false },
    legacyOperationalSustainabilityAssessment: { isSustained: true, selfFinancingCapacity: 'HIGH', operationalCashConsistency: 'HIGH_CONSISTENCY', operationalFragilityIndex: 0, dependencyTrend: 'STABLE', resilienceScore: 100, longitudinalConsistency: '' },
    fiduciaryOperationalSustainabilityAssessment: { classification: fcoPositive ? 'OPERATIONALLY_SUSTAINABLE' : 'DEPENDENT_ON_EXTERNAL_CAPITAL', resilienceScore: 100, operationalFragilityIndex: 0, longitudinalConsistency: '' },
    continuityRisk: { continuityRisk: 'LOW', hasRuptureRisk: false, projectedRunwayMonths: runway, runwayClassification: 'HEALTHY', runwayConfidence: 'HIGH', runwayDistortionFactors: [], runwayStability: 'STABLE', liquidityDependency: false, continuityRiskDrivers: [], recommendedActions: [] },
    fiduciaryNarrative: { executiveNarrative: '', fiduciaryOpinion: '', fiduciaryWarnings: [], blockedInterpretations: [], causalFindings: [], institutionalImplications: [] },
    blockedConclusions: [],
    allowedConclusions: fcoPositive ? ['OPERATIONAL_GENERATION'] : [],
    confidenceLevel: 'HIGH', auditTrail: [], lineageHash: '', cashIntelligenceLineageHash: '', causalReferences: [], score: 100
  };
};

describe('LongitudinalCashIntelligenceEngine', () => {

  it('contexto A: Turnaround Legítimo / Recuperação Real', () => {
    const p1 = createMockOutput(2, false, 'LIQUIDITY_DEPENDENT');
    const p2 = createMockOutput(4, true, 'REINVESTIMENTO_OPERACIONAL_SAUDAVEL');
    const p3 = createMockOutput(6, true, 'REINVESTIMENTO_OPERACIONAL_SAUDAVEL');
    const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2, p3]);

    assert.equal(result.longitudinalOut.trajectoryClassification, 'STRUCTURAL_IMPROVEMENT');
    assert.equal(result.longitudinalOut.runwayEvolutionTrend, 'UP');
    assert.equal(result.longitudinalOut.narrativeLongitudinal.isRecoveryReal, true);
  });

  it('contexto B: Turnaround Artificial', () => {
    // Runway melhora, mas o FCO não é positivo e tem dependência crônica
    const p1 = createMockOutput(2, false, 'LIQUIDITY_DEPENDENT');
    const p2 = createMockOutput(4, false, 'LIQUIDEZ_ARTIFICIAL');
    const p3 = createMockOutput(8, false, 'LIQUIDEZ_ARTIFICIAL'); // capitalização massiva
    const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2, p3]);

    // O ratio de dependency é 2/3 = 66%, então crônica tem precedência ou turnaroud.
    assert.ok(['ARTIFICIAL_TURNAROUND', 'CHRONIC_DEPENDENCY'].includes(result.longitudinalOut.trajectoryClassification));
    assert.equal(result.longitudinalOut.narrativeLongitudinal.isRecoveryReal, false);
    assert.ok(result.longitudinalOut.blockedConclusions.includes('REAL_RECOVERY'));
  });

  it('contexto C: Deterioração Progressiva', () => {
    const p1 = createMockOutput(10, true, 'OPERATIONALLY_SUSTAINABLE');
    const p2 = createMockOutput(6, false, 'LIQUIDITY_DEPENDENT');
    const p3 = createMockOutput(3, false, 'CONTINUITY_RISK');
    const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2, p3]);

    assert.equal(result.longitudinalOut.trajectoryClassification, 'PROGRESSIVE_DETERIORATION');
    assert.equal(result.longitudinalOut.runwayEvolutionTrend, 'DOWN');
  });

  it('contexto D: Histórico Incompleto (Fail-Closed)', () => {
    const p1 = createMockOutput(10, true, 'OPERATIONALLY_SUSTAINABLE');
    const p2 = createMockOutput(6, false, 'LIQUIDITY_DEPENDENT');
    const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2]);

    assert.equal(result.longitudinalOut.trajectoryClassification, 'INSUFFICIENT_HISTORICAL_DATA');
    assert.ok(result.longitudinalOut.blockedConclusions.includes('REAL_RECOVERY'));
  });

  it('contexto E: Recuperação Volátil', () => {
    const p1 = createMockOutput(3, false, 'LIQUIDITY_DEPENDENT');
    const p2 = createMockOutput(6, true, 'OPERATIONALLY_SUSTAINABLE'); // Sobe
    const p3 = createMockOutput(4, false, 'CONTINUITY_RISK'); // Desce
    const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2, p3]);

    assert.equal(result.longitudinalOut.trajectoryClassification, 'VOLATILE_RECOVERY');
    assert.equal(result.longitudinalOut.runwayEvolutionTrend, 'VOLATILE');
  });

});
