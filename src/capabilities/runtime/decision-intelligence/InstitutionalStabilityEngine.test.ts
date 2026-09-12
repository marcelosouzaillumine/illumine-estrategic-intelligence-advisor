import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { InstitutionalStabilityEngine } from './InstitutionalStabilityEngine';
import { InstitutionalStabilityInput } from './InstitutionalStabilityTypes';

function mockInput(overrides: any = {}): InstitutionalStabilityInput {
  return {
    reconciliation: {
      reconciliationStatus: 'PASSED',
      failedAxes: [],
      blockingFlags: [],
      severity: 'NONE',
      reconciliationToleranceUsed: 0,
      ...(overrides.reconciliation || {})
    },
    cashCycles: [],
    longitudinalCash: {
      trajectoryClassification: 'STABLE_SUSTAINABILITY',
      narrativeLongitudinal: { executiveNarrative: '', institutionalAnalysis: '' },
      recoveryNarrativeBlocked: false,
      ...(overrides.longitudinalCash || {})
    },
    fiduciaryTimeline: {
      timelineIntegrityStatus: 'VALID',
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
    }
  };
}

describe('InstitutionalStabilityEngine', () => {

  it('should return BLOCKED_BY_ACCOUNTING_INTEGRITY if reconciliation failed', () => {
    const input = mockInput({ reconciliation: { reconciliationStatus: 'FAILED' } });
    const result = InstitutionalStabilityEngine.evaluate(input);
    assert.equal(result.stabilityClassification, 'BLOCKED_BY_ACCOUNTING_INTEGRITY');
    assert.equal(result.stabilityScore, 'NOT_AVAILABLE');
  });

  it('should evaluate STRUCTURALLY_STABLE for a healthy institution', () => {
    const input = mockInput();
    const result = InstitutionalStabilityEngine.evaluate(input);
    assert.equal(result.stabilityClassification, 'STRUCTURALLY_STABLE');
    assert.equal(result.continuityRiskLevel, 'LOW');
    assert.equal(result.resilienceAssessment, 'HIGH_RESILIENCE');
    assert.ok((result.stabilityScore as number) >= 80);
  });

  it('should evaluate APPARENT_STABILITY when artificial liquidity props up cash', () => {
    const input = mockInput({
      causalityOutput: { liquidityQualityImpact: 'LIQUIDEZ_ARTIFICIAL_VINCULADA' },
      longitudinalCash: { trajectoryClassification: 'ARTIFICIAL_TURNAROUND' }
    });
    const result = InstitutionalStabilityEngine.evaluate(input);
    assert.equal(result.stabilityClassification, 'APPARENT_STABILITY');
    assert.equal(result.resilienceAssessment, 'FRAGILE_RESILIENCE');
    // Check artificial turnaround ceiling
    assert.ok((result.stabilityScore as number) <= 35);
  });

  it('should evaluate FRAGILE_STABILITY with FCO volatility and working capital stress', () => {
    const input = mockInput({
      behavioralPatterns: { dominantBehavioralPattern: 'RECURRENT_WORKING_CAPITAL_STRESS', behavioralRiskScore: 40 },
      accountabilityOutput: { accountabilityScore: 60 }
    });
    const result = InstitutionalStabilityEngine.evaluate(input);
    assert.equal(result.stabilityClassification, 'FRAGILE_STABILITY');
    assert.equal(result.continuityRiskLevel, 'MODERATE');
  });

  it('should evaluate UNSTABLE for recurring negative FCO and high risk', () => {
    const input = mockInput({
      causalityOutput: { fcoImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO' },
      behavioralPatterns: { behavioralRiskScore: 70 }, // -20 penalty
      accountabilityOutput: { accountabilityScore: 40 }, // -20 penalty
      longitudinalCash: { trajectoryClassification: 'CHRONIC_DEPENDENCY' }
    });
    const result = InstitutionalStabilityEngine.evaluate(input);
    // Score starts at 100.
    // -25 (FCO Negativo)
    // -20 (Behavioral)
    // -20 (Accountability)
    // = 35. Ceiling for CHRONIC_DEPENDENCY is 40. Score is 35 -> UNSTABLE
    assert.equal(result.stabilityClassification, 'UNSTABLE');
  });

  it('should evaluate COLLAPSE_RISK for Structural Cash Collapse trajectory', () => {
    const input = mockInput({
      longitudinalCash: { trajectoryClassification: 'STRUCTURAL_CASH_COLLAPSE' },
      accountabilityOutput: { accountabilityStatus: 'NON_CORRECTIVE_MANAGEMENT_PATTERN' }
    });
    const result = InstitutionalStabilityEngine.evaluate(input);
    assert.equal(result.stabilityClassification, 'COLLAPSE_RISK');
    assert.ok((result.stabilityScore as number) <= 15);
    assert.equal(result.continuityRiskLevel, 'CRITICAL');
  });

  it('should reduce score and limit classification if Narrative Drift is CRITICAL', () => {
    const input = mockInput({
      driftOutput: { driftSeverity: 'CRITICAL', driftDetected: true }
    });
    const result = InstitutionalStabilityEngine.evaluate(input);
    // Starting score 100, CRITICAL drift -> -20 penalty -> 80.
    // Ceiling for CRITICAL drift is 40.
    // So final score must be <= 40 -> STABLE_BUT_MONITORED or UNSTABLE
    assert.ok((result.stabilityScore as number) <= 40);
    assert.equal(result.stabilityClassification, 'STABLE_BUT_MONITORED');
  });

  it('should evaluate CRITICAL_INSTABILITY', () => {
    const input = mockInput({
      causalityOutput: { fcoImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO', runwayImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO' },
      accountabilityOutput: { accountabilityStatus: 'RECURRENT_STRUCTURAL_FAILURE', accountabilityScore: 20 },
      longitudinalCash: { trajectoryClassification: 'PROGRESSIVE_DETERIORATION' }
    });
    const result = InstitutionalStabilityEngine.evaluate(input);
    // Score: 100 - 25(runway) - 25(FCO) - 20(accountability) = 30. Ceiling for PROGRESSIVE_DETERIORATION is 30.
    // Wait, RECURRENT_STRUCTURAL_FAILURE ceiling is 25.
    // Score = 25 -> CRITICAL_INSTABILITY (since 15 <= 25 < 30)
    assert.equal(result.stabilityClassification, 'CRITICAL_INSTABILITY');
  });
});
