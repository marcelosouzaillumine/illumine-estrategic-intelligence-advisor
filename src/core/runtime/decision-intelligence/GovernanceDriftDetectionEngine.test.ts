import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { GovernanceDriftDetectionEngine } from './GovernanceDriftDetectionEngine';
import { GovernanceDriftDetectionInput } from './GovernanceDriftTypes';

function mockInput(executiveNarrative: string, overrides: any = {}): GovernanceDriftDetectionInput {
  return {
    executiveNarrative,
    longitudinalCash: {
      trajectoryClassification: 'STABLE_SUSTAINABILITY',
      narrativeLongitudinal: { executiveNarrative: '', institutionalAnalysis: '' },
      recoveryNarrativeBlocked: false,
      ...(overrides.longitudinalCash || {})
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
    reconciliation: {
      reconciliationStatus: 'PASSED',
      failedAxes: [],
      blockingFlags: [],
      severity: 'NONE',
      reconciliationToleranceUsed: 0,
      ...(overrides.reconciliation || {})
    },
    fiduciaryTimeline: {
      timelineIntegrityStatus: 'VALID'
    } as any
  };
}

describe('GovernanceDriftDetectionEngine', () => {

  it('should detect OPTIMISTIC_LIQUIDITY_DRIFT', () => {
    const input = mockInput('Nossa empresa mantém uma liquidez forte e saudável.', {
      causalityOutput: { fcoImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO' }
    });
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.equal(result.driftDetected, true);
    assert.ok(result.driftTypes.includes('OPTIMISTIC_LIQUIDITY_DRIFT'));
    assert.ok(result.narrativeRiskScore > 0);
  });

  it('should detect SUSTAINABLE_GROWTH_DRIFT', () => {
    const input = mockInput('Este trimestre apresentou crescimento sustentável da operação.', {
      behavioralPatterns: { dominantBehavioralPattern: 'CHRONIC_OVEREXPANSION' }
    });
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.ok(result.driftTypes.includes('SUSTAINABLE_GROWTH_DRIFT'));
  });

  it('should detect ARTIFICIAL_TURNAROUND_DRIFT', () => {
    const input = mockInput('Fizemos um turnaround e recuperação estrutural do caixa.', {
      longitudinalCash: { trajectoryClassification: 'ARTIFICIAL_TURNAROUND' }
    });
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.ok(result.driftTypes.includes('ARTIFICIAL_TURNAROUND_DRIFT'));
  });

  it('should detect GOVERNANCE_MATURITY_DRIFT', () => {
    const input = mockInput('Temos uma maturidade de governança muito forte.', {
      behavioralPatterns: { dominantBehavioralPattern: 'TREASURY_NEGLECT' }
    });
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.ok(result.driftTypes.includes('GOVERNANCE_MATURITY_DRIFT'));
  });

  it('should detect RISK_UNDERSTATEMENT_DRIFT', () => {
    const input = mockInput('O cenário está com o risco mitigado.', {
      causalityOutput: { continuityRiskImpact: 'RISCO_DIRETO_VINCULADO' }
    });
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.ok(result.driftTypes.includes('RISK_UNDERSTATEMENT_DRIFT'));
  });

  it('should return ACCOUNTING_INTEGRITY_BLOCKED for FAILED reconciliation', () => {
    const input = mockInput('Nossa liquidez forte garante futuro saudável.', {
      reconciliation: { reconciliationStatus: 'FAILED' }
    });
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.ok(result.driftTypes.includes('ACCOUNTING_INTEGRITY_BLOCKED'));
    assert.equal(result.driftSeverity, 'CRITICAL');
    assert.equal(result.narrativeRiskScore, 100);
  });

  it('should detect multiple drifts simultaneously', () => {
    const input = mockInput('Aliquidez forte sustenta o crescimento sustentável contínuo.', {
      causalityOutput: { fcoImpactAssessment: 'IMPACTO_NEGATIVO_OBSERVADO' },
      behavioralPatterns: { dominantBehavioralPattern: 'CHRONIC_OVEREXPANSION' }
    });
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.ok(result.driftTypes.includes('OPTIMISTIC_LIQUIDITY_DRIFT'));
    assert.ok(result.driftTypes.includes('SUSTAINABLE_GROWTH_DRIFT'));
    assert.equal(result.driftSeverity, 'HIGH');
  });

  it('should return NO_DRIFT when narrative matches reality', () => {
    const input = mockInput('Nossa empresa mantém uma liquidez forte e crescimento sustentável.', {});
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.equal(result.driftDetected, false);
    assert.ok(result.driftTypes.includes('NO_DRIFT'));
    assert.equal(result.narrativeRiskScore, 0);
  });

  it('should return NO_DRIFT (empty) if narrative is not provided', () => {
    const input = mockInput('', {});
    const result = GovernanceDriftDetectionEngine.evaluate(input);
    assert.equal(result.driftDetected, false);
    assert.ok(result.driftTypes.includes('NO_DRIFT'));
    assert.equal(result.confidence, 'MODERATE'); // empty narrative is not an error but not high confidence
  });

});
