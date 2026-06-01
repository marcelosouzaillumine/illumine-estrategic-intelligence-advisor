import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { InstitutionalBehavioralPatternsEngine } from './InstitutionalBehavioralPatternsEngine';
import { InstitutionalBehavioralPatternsInput } from './InstitutionalBehavioralTypes';

function mockInput(overrides: any = {}): InstitutionalBehavioralPatternsInput {
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
    longitudinalCash: {
      trajectoryClassification: 'STABLE_SUSTAINABILITY',
      narrativeLongitudinal: { executiveNarrative: '', institutionalAnalysis: '' },
      recoveryNarrativeBlocked: false,
      ...(overrides.longitudinalCash || {})
    },
    fiduciaryTimeline: {
      timelineIntegrityStatus: 'VERIFIED',
      longitudinalCyclesCount: 3,
      events: [],
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

describe('InstitutionalBehavioralPatternsEngine', () => {

  it('should return BLOCKED_BY_ACCOUNTING_INTEGRITY if reconciliation failed', () => {
    const input = mockInput({ reconciliation: { reconciliationStatus: 'FAILED' } });
    const result = InstitutionalBehavioralPatternsEngine.evaluate(input);
    assert.equal(result.dominantBehavioralPattern, 'BLOCKED_BY_ACCOUNTING_INTEGRITY');
    assert.equal(result.governanceMaturitySignal, 'BLOCKED');
  });

  it('should return INSUFFICIENT_DECISION_EVIDENCE if learning signal is NOT_AVAILABLE', () => {
    const input = mockInput({ memoryOutput: { institutionalLearningSignal: 'NOT_AVAILABLE' } });
    const result = InstitutionalBehavioralPatternsEngine.evaluate(input);
    assert.equal(result.dominantBehavioralPattern, 'INSUFFICIENT_DECISION_EVIDENCE');
    assert.equal(result.governanceMaturitySignal, 'INSUFFICIENT_EVIDENCE');
  });

  it('should classify STRATEGIC_DISCIPLINE when metrics are stable and learning is positive', () => {
    const input = mockInput(); // Default has STABLE_SUSTAINABILITY and no destructive patterns
    const result = InstitutionalBehavioralPatternsEngine.evaluate(input);
    assert.equal(result.dominantBehavioralPattern, 'STRATEGIC_DISCIPLINE');
    assert.ok(result.behavioralRiskScore !== 'NOT_AVAILABLE' && result.behavioralRiskScore <= 30);
    assert.equal(result.governanceMaturitySignal, 'STABLE');
  });

  it('should classify RECURRENT_WORKING_CAPITAL_STRESS', () => {
    const input = mockInput({
      memoryOutput: {
        institutionalLearningSignal: 'NEGATIVE',
        recurringDecisionPatterns: ['INVENTORY_EXPANSION']
      },
      causalityOutput: {
        confidence: 'HIGH_CONFIDENCE_CAUSAL_CHAIN',
        fiduciaryWarnings: [],
        causalChains: [{ chainType: 'INVENTORY_EXPANSION_TO_CASH_PRESSURE', triggerEvent: { observedImpact: { runwayImpactMonths: -1 } } }]
      }
    });
    const result = InstitutionalBehavioralPatternsEngine.evaluate(input);
    assert.equal(result.dominantBehavioralPattern, 'RECURRENT_WORKING_CAPITAL_STRESS');
    assert.ok((result.behavioralRiskScore as number) >= 60);
  });

  it('should classify CAPITAL_DEPENDENCY_BEHAVIOR', () => {
    const input = mockInput({
      memoryOutput: { institutionalLearningSignal: 'NEGATIVE', decisionMemoryWarnings: [] },
      causalityOutput: {
        confidence: 'HIGH_CONFIDENCE_CAUSAL_CHAIN',
        fiduciaryWarnings: [],
        causalChains: [{ chainType: 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY' }]
      },
      longitudinalCash: { trajectoryClassification: 'CHRONIC_DEPENDENCY' }
    });
    const result = InstitutionalBehavioralPatternsEngine.evaluate(input);
    assert.equal(result.dominantBehavioralPattern, 'CAPITAL_DEPENDENCY_BEHAVIOR');
    assert.ok((result.behavioralRiskScore as number) >= 80);
    assert.equal(result.governanceMaturitySignal, 'DETERIORATING');
  });

  it('should classify ARTIFICIAL_SCALING when both capital dependency and overexpansion exist', () => {
    const input = mockInput({
      memoryOutput: { 
        institutionalLearningSignal: 'NEGATIVE', 
        destructiveDecisionRecurrence: true,
        recurringDecisionPatterns: ['INVENTORY_EXPANSION'],
        decisionMemoryWarnings: []
      },
      causalityOutput: {
        confidence: 'HIGH_CONFIDENCE_CAUSAL_CHAIN',
        fiduciaryWarnings: [],
        causalChains: [
          { chainType: 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY' },
          { chainType: 'CAPEX_WITHOUT_OPERATIONAL_RETURN' }
        ]
      },
      longitudinalCash: { trajectoryClassification: 'CHRONIC_DEPENDENCY' }
    });
    const result = InstitutionalBehavioralPatternsEngine.evaluate(input);
    assert.equal(result.dominantBehavioralPattern, 'ARTIFICIAL_SCALING');
    assert.ok(result.secondaryBehavioralPatterns.includes('CAPITAL_DEPENDENCY_BEHAVIOR'));
    assert.ok(result.secondaryBehavioralPatterns.includes('CHRONIC_OVEREXPANSION'));
  });

  it('should classify TREASURY_NEGLECT when runway deteriorates without corrective actions', () => {
    const input = mockInput({
      memoryOutput: { institutionalLearningSignal: 'NEGATIVE', decisionMemoryWarnings: [] },
      causalityOutput: { confidence: 'HIGH_CONFIDENCE_CAUSAL_CHAIN', causalChains: [], fiduciaryWarnings: [] },
      longitudinalCash: { trajectoryClassification: 'PROGRESSIVE_DETERIORATION' }
    });
    const result = InstitutionalBehavioralPatternsEngine.evaluate(input);
    assert.equal(result.dominantBehavioralPattern, 'TREASURY_NEGLECT');
    assert.ok((result.behavioralRiskScore as number) > 80);
  });

  it('should classify GOVERNANCE_MATURITY_EVOLUTION when there is real recovery and corrective evidence', () => {
    const input = mockInput({
      memoryOutput: { 
        institutionalLearningSignal: 'POSITIVE',
        destructiveDecisionRecurrence: false,
        correctiveDecisionEvidence: true,
        decisionMemoryWarnings: [],
        recurringDecisionPatterns: []
      },
      causalityOutput: {
        confidence: 'HIGH_CONFIDENCE_CAUSAL_CHAIN',
        fiduciaryWarnings: [],
        causalChains: [{ chainType: 'CORRECTIVE_ACTION_TO_RECOVERY' }]
      },
      longitudinalCash: { trajectoryClassification: 'REAL_RECOVERY' }
    });
    const result = InstitutionalBehavioralPatternsEngine.evaluate(input);
    assert.equal(result.dominantBehavioralPattern, 'GOVERNANCE_MATURITY_EVOLUTION');
    assert.equal(result.governanceMaturitySignal, 'MATURING');
  });

});
