import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { ExecutiveAccountabilityEngine } from './ExecutiveAccountabilityEngine';
import { ExecutiveAccountabilityInput } from './ExecutiveAccountabilityTypes';

function mockInput(overrides: any = {}): ExecutiveAccountabilityInput {
  return {
    memoryOutput: {
      recurringDecisionPatterns: [],
      destructiveDecisionRecurrence: false,
      correctiveDecisionEvidence: false,
      institutionalLearningSignal: 'NEUTRAL',
      decisionDisciplineScore: 50,
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
    reconciliation: {
      reconciliationStatus: 'PASSED',
      failedAxes: [],
      blockingFlags: [],
      severity: 'NONE',
      reconciliationToleranceUsed: 0,
      ...(overrides.reconciliation || {})
    }
  };
}

describe('ExecutiveAccountabilityEngine', () => {

  it('should return BLOCKED_BY_ACCOUNTING_INTEGRITY if reconciliation failed', () => {
    const input = mockInput({ reconciliation: { reconciliationStatus: 'CASH_RECONCILIATION_FAIL_CLOSED' } });
    const result = ExecutiveAccountabilityEngine.evaluate(input);
    assert.equal(result.accountabilityStatus, 'BLOCKED_BY_ACCOUNTING_INTEGRITY');
    assert.equal(result.accountabilityScore, 'NOT_AVAILABLE');
  });

  it('should return INSUFFICIENT_ACCOUNTABILITY_EVIDENCE if no memory signal', () => {
    const input = mockInput({ memoryOutput: { institutionalLearningSignal: 'NOT_AVAILABLE' } });
    const result = ExecutiveAccountabilityEngine.evaluate(input);
    assert.equal(result.accountabilityStatus, 'INSUFFICIENT_ACCOUNTABILITY_EVIDENCE');
  });

  it('should evaluate HIGH_EXECUTIVE_DISCIPLINE when runway is stable with proper correctives', () => {
    const input = mockInput({
      memoryOutput: { correctiveDecisionEvidence: true, destructiveDecisionRecurrence: false },
      longitudinalCash: { trajectoryClassification: 'STABLE_SUSTAINABILITY' }
    });
    const result = ExecutiveAccountabilityEngine.evaluate(input);
    assert.equal(result.accountabilityStatus, 'HIGH_EXECUTIVE_DISCIPLINE');
    assert.ok((result.accountabilityScore as number) >= 85);
  });

  it('should evaluate RECURRENT_STRUCTURAL_FAILURE on continuous destruction and deterioration', () => {
    const input = mockInput({
      memoryOutput: { destructiveDecisionRecurrence: true, correctiveDecisionEvidence: false },
      longitudinalCash: { trajectoryClassification: 'PROGRESSIVE_DETERIORATION' }
    });
    const result = ExecutiveAccountabilityEngine.evaluate(input);
    assert.equal(result.accountabilityStatus, 'RECURRENT_STRUCTURAL_FAILURE');
    assert.ok((result.accountabilityScore as number) < 35);
  });

  it('should evaluate CHRONIC_REACTION_DELAY when capital dependency exists despite correctives', () => {
    const input = mockInput({
      memoryOutput: { correctiveDecisionEvidence: true },
      causalityOutput: { causalChains: [{ chainType: 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY' }] },
      longitudinalCash: { trajectoryClassification: 'PROGRESSIVE_DETERIORATION' }
    });
    const result = ExecutiveAccountabilityEngine.evaluate(input);
    assert.equal(result.accountabilityStatus, 'CHRONIC_REACTION_DELAY');
  });

  it('should evaluate REACTIVE_CORRECTION', () => {
    const input = mockInput({
      memoryOutput: { correctiveDecisionEvidence: true },
      behavioralPatterns: { dominantBehavioralPattern: 'REACTIVE_MANAGEMENT' },
      longitudinalCash: { trajectoryClassification: 'CHRONIC_DEPENDENCY' }
    });
    const result = ExecutiveAccountabilityEngine.evaluate(input);
    assert.equal(result.accountabilityStatus, 'REACTIVE_CORRECTION');
  });

  it('should lower score if Narrative Drift is detected', () => {
    const inputWithoutDrift = mockInput({
      memoryOutput: { correctiveDecisionEvidence: true },
      longitudinalCash: { trajectoryClassification: 'STABLE_SUSTAINABILITY' }
    });
    
    const inputWithDrift = mockInput({
      memoryOutput: { correctiveDecisionEvidence: true },
      longitudinalCash: { trajectoryClassification: 'STABLE_SUSTAINABILITY' },
      driftOutput: { driftDetected: true, driftSeverity: 'HIGH' }
    });
    
    const resWithout = ExecutiveAccountabilityEngine.evaluate(inputWithoutDrift);
    const resWith = ExecutiveAccountabilityEngine.evaluate(inputWithDrift);
    
    assert.ok((resWith.accountabilityScore as number) < (resWithout.accountabilityScore as number));
    assert.equal(resWith.executiveConsistencySignal, 'INCONSISTENTE');
  });

});
