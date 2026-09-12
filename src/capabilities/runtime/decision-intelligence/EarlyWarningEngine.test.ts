import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { EarlyWarningEngine } from './EarlyWarningEngine';
import { EarlyWarningIntelligenceInput } from './EarlyWarningTypes';

function mockInput(overrides: any = {}): EarlyWarningIntelligenceInput {
  return {
    reconciliation: {
      reconciliationStatus: 'PASSED',
      failedAxes: [],
      blockingFlags: [],
      severity: 'NONE',
      reconciliationToleranceUsed: 0,
      ...(overrides.reconciliation || {})
    },
    cashCycles: [
      { fcoResult: 'CASH_GENERATION' } as any,
      { fcoResult: 'CASH_GENERATION' } as any,
      { fcoResult: 'CASH_GENERATION' } as any
    ],
    longitudinalCash: {
      trajectoryClassification: 'STABLE_SUSTAINABILITY',
      narrativeLongitudinal: { executiveNarrative: '', institutionalAnalysis: '' },
      recoveryNarrativeBlocked: false,
      ...(overrides.longitudinalCash || {})
    },
    fiduciaryTimeline: {
      timelineIntegrityStatus: 'VALID',
      longitudinalCyclesCount: 3,
      ...(overrides.fiduciaryTimeline || {})
    },
    memoryOutput: {
      recurringDecisionPatterns: [],
      destructiveDecisionRecurrence: false,
      correctiveDecisionEvidence: true,
      institutionalLearningSignal: 'POSITIVE',
      decisionDisciplineScore: 90,
      decisionMemoryWarnings: [],
      ...(overrides.memoryOutput || {})
    },
    causalityOutput: {
      causalChains: [],
      decisionImpactMap: {},
      affectedFinancialMetrics: [],
      runwayImpactAssessment: 'ESTABILIZADO',
      fcoImpactAssessment: 'ESTABILIZADO',
      liquidityQualityImpact: 'SEM_DISTORCAO_CAUSAL',
      continuityRiskImpact: 'SEM_RISCO_VINCULADO',
      confidence: 'HIGH_CONFIDENCE_CAUSAL_CHAIN',
      evidenceTrail: [],
      causalityLimitations: [],
      fiduciaryWarnings: [],
      ...(overrides.causalityOutput || {})
    },
    behavioralPatterns: {
      dominantBehavioralPattern: 'DISCIPLINED_EXECUTION',
      secondaryBehavioralPatterns: [],
      behavioralRiskScore: 10,
      governanceMaturitySignal: 'STABLE',
      behavioralEvidence: [],
      repeatedPatterns: [],
      correctiveSignals: true,
      fiduciaryWarnings: [],
      confidence: 'HIGH',
      narrativeBehavioralAssessment: '',
      ...(overrides.behavioralPatterns || {})
    },
    driftOutput: {
      driftDetected: false,
      driftSeverity: 'NONE',
      driftTypes: ['NO_DRIFT'],
      conflictingClaims: [],
      fiduciaryReality: [],
      affectedDomains: [],
      narrativeRiskScore: 0,
      evidenceTrail: [],
      recommendedNarrativeCorrections: [],
      blockedOptimisticClaims: [],
      confidence: 'HIGH',
      fiduciaryWarnings: [],
      ...(overrides.driftOutput || {})
    },
    accountabilityOutput: {
      accountabilityScore: 90,
      accountabilityStatus: 'HIGH_EXECUTIVE_DISCIPLINE',
      reactionSpeedAssessment: 'RÁPIDA_E_EFICAZ',
      correctiveDisciplineAssessment: 'CONSOLIDADA',
      crisisResponseQuality: 'ESTABILIZADORA',
      institutionalLearningAssessment: 'EVIDÊNCIA_DE_APRENDIZADO',
      recurrenceSeverity: 'BAIXA_REINCIDÊNCIA',
      executiveConsistencySignal: 'COERENTE',
      stabilizationCapability: 'DEMONSTRADA',
      accountabilityWarnings: [],
      evidenceTrail: [],
      confidence: 'HIGH',
      narrativeAccountabilityAssessment: '',
      ...(overrides.accountabilityOutput || {})
    },
    stabilityOutput: {
      stabilityScore: 90,
      stabilityClassification: 'STRUCTURALLY_STABLE',
      stabilityConfidence: 'HIGH',
      dominantStabilityDrivers: [],
      destabilizingFactors: [],
      stabilizingFactors: [],
      structuralFragilityFlags: [],
      continuityRiskLevel: 'LOW',
      resilienceAssessment: 'HIGH_RESILIENCE',
      institutionalMaturitySignal: 'STABLE',
      evidenceTrail: [],
      fiduciaryWarnings: [],
      narrativeStabilityAssessment: '',
      ...(overrides.stabilityOutput || {})
    }
  };
}

describe('EarlyWarningEngine', () => {

  it('should evaluate STABLE_MONITORING when risks are nonexistent or minimal', () => {
    const input = mockInput();
    const result = EarlyWarningEngine.evaluate(input);
    assert.equal(result.earlyWarningLevel, 'STABLE_MONITORING');
    assert.ok((result.earlyWarningScore as number) <= 20);
  });

  it('should detect EARLY_STRUCTURAL_STRESS when minor stress signals appear', () => {
    const input = mockInput({
      causalityOutput: { runwayImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO' },
      accountabilityOutput: { accountabilityScore: 40 }
    });
    const result = EarlyWarningEngine.evaluate(input);
    assert.equal(result.earlyWarningLevel, 'EARLY_STRUCTURAL_STRESS');
    assert.ok((result.earlyWarningScore as number) >= 20);
  });

  it('should evaluate EMERGING_WORKING_CAPITAL_PRESSURE', () => {
    const input = mockInput({
      behavioralPatterns: { dominantBehavioralPattern: 'RECURRENT_WORKING_CAPITAL_STRESS' },
      causalityOutput: { runwayImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO' }
    });
    const result = EarlyWarningEngine.evaluate(input);
    assert.equal(result.earlyWarningLevel, 'EMERGING_WORKING_CAPITAL_PRESSURE');
    assert.ok(result.emergingPatterns.length > 0);
  });

  it('should detect EMERGING_LIQUIDITY_DEPENDENCY', () => {
    const input = mockInput({
      causalityOutput: { runwayImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO', causalChains: [{ chainType: 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY' }] }
    });
    const result = EarlyWarningEngine.evaluate(input);
    assert.equal(result.earlyWarningLevel, 'EMERGING_LIQUIDITY_DEPENDENCY');
  });

  it('should evaluate STRUCTURAL_DETERIORATION_ACCELERATION', () => {
    const input = mockInput({
      causalityOutput: { fcoImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO', runwayImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO' },
      accountabilityOutput: { accountabilityScore: 40 },
      longitudinalCash: { trajectoryClassification: 'PROGRESSIVE_DETERIORATION' }
    });
    const result = EarlyWarningEngine.evaluate(input);
    assert.equal(result.earlyWarningLevel, 'STRUCTURAL_DETERIORATION_ACCELERATION');
    assert.equal(result.deteriorationVelocity, 'ACCELERATING');
  });

  it('should return BLOCKED_BY_ACCOUNTING_INTEGRITY if accounting fails', () => {
    const input = mockInput({
      reconciliation: { reconciliationStatus: 'FAILED' }
    });
    const result = EarlyWarningEngine.evaluate(input);
    assert.equal(result.earlyWarningLevel, 'BLOCKED_BY_ACCOUNTING_INTEGRITY');
    assert.equal(result.earlyWarningScore, 'NOT_AVAILABLE');
  });

  it('should evaluate CRITICAL_CONTINUITY_THREAT for a collapsing scenario', () => {
    const input = mockInput({
      causalityOutput: { fcoImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO', runwayImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO', liquidityQualityImpact: 'LIQUIDEZ_ARTIFICIAL_VINCULADA' },
      stabilityOutput: { stabilityClassification: 'COLLAPSE_RISK' },
      memoryOutput: { correctiveDecisionEvidence: false },
      accountabilityOutput: { accountabilityScore: 20 },
      driftOutput: { driftSeverity: 'CRITICAL' }
    });
    const result = EarlyWarningEngine.evaluate(input);
    assert.equal(result.earlyWarningLevel, 'CRITICAL_CONTINUITY_THREAT');
    assert.equal(result.projectedContinuityRisk, 'CRITICAL');
  });

});
