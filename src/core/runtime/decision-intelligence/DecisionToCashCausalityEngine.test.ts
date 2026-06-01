import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { DecisionToCashCausalityEngine } from './DecisionToCashCausalityEngine';
import { ExecutiveDecisionEvent, DecisionCategory } from './InstitutionalDecisionTypes';
import { DecisionToCashCausalityInput } from './DecisionToCashCausalityTypes';

function mockDecision(type: DecisionCategory, fco: number, runway: number, risk: boolean = false, recurrence: boolean = false): ExecutiveDecisionEvent {
  return {
    decisionId: `dec-${Math.random()}`,
    decisionType: type,
    decisionDate: new Date().toISOString(),
    affectedDomain: 'OPERATION',
    expectedImpact: 'Melhorar operação',
    observedImpact: {
      fcoImpact: fco,
      runwayImpactMonths: runway,
      workingCapitalImpact: 0
    },
    linkedFinancialCycle: '2023-Q1',
    evidenceSource: 'DRE_DFC',
    confidence: 'HIGH',
    lineageHash: 'hash-123',
    decisionSeverity: 'HIGH',
    recurrenceFlag: recurrence,
    fiduciaryRiskFlag: risk
  };
}

function mockInput(decisions: ExecutiveDecisionEvent[], isBroken: boolean = false): DecisionToCashCausalityInput {
  return {
    decisions,
    cashCycles: [{ isAvailable: true } as any],
    longitudinalCash: { trajectoryClassification: 'STABLE_SUSTAINABILITY' } as any,
    fiduciaryTimeline: { timelineIntegrityStatus: isBroken ? 'BROKEN' : 'VERIFIED' } as any,
    financialContext: {}
  };
}

describe('DecisionToCashCausalityEngine', () => {

  it('should return BLOCKED_BY_ACCOUNTING_INTEGRITY if timeline is broken', () => {
    const input = mockInput([mockDecision('INVENTORY_EXPANSION', -100, -2)], true);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    assert.equal(result.confidence, 'BLOCKED_BY_ACCOUNTING_INTEGRITY');
    assert.equal(result.causalChains.length, 0);
  });

  it('should return CAUSALITY_NOT_ESTABLISHED if no decisions provided', () => {
    const input = mockInput([]);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    assert.equal(result.confidence, 'CAUSALITY_NOT_ESTABLISHED');
    assert.equal(result.causalChains.length, 0);
  });

  it('should establish INVENTORY_EXPANSION_TO_CASH_PRESSURE', () => {
    const input = mockInput([mockDecision('INVENTORY_EXPANSION', -100, -2, false, true)]);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    
    assert.equal(result.causalChains[0].chainType, 'INVENTORY_EXPANSION_TO_CASH_PRESSURE');
    assert.equal(result.causalChains[0].confidence, 'HIGH_CONFIDENCE_CAUSAL_CHAIN'); // due to recurrence
    assert.ok(result.affectedFinancialMetrics.includes('FCO'));
  });

  it('should establish CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS', () => {
    const input = mockInput([mockDecision('CUSTOMER_CREDIT_EXPANSION', -50, -1)]);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    
    assert.equal(result.causalChains[0].chainType, 'CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS');
    assert.equal(result.causalChains[0].confidence, 'MODERATE_CONFIDENCE_CAUSAL_CHAIN');
  });

  it('should establish CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY', () => {
    const input = mockInput([mockDecision('EMERGENCY_CAPITALIZATION', -100, 5, true)]);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    
    assert.equal(result.causalChains[0].chainType, 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY');
    assert.equal(result.liquidityQualityImpact, 'LIQUIDEZ_ARTIFICIAL_VINCULADA');
  });

  it('should establish CAPEX_WITHOUT_OPERATIONAL_RETURN', () => {
    const input = mockInput([mockDecision('CAPEX_EXPANSION', 0, -2)]);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    
    assert.equal(result.causalChains[0].chainType, 'CAPEX_WITHOUT_OPERATIONAL_RETURN');
  });

  it('should establish DISTRIBUTION_TO_CONTINUITY_RISK', () => {
    const input = mockInput([mockDecision('DIVIDEND_DISTRIBUTION', -50, -5, true)]);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    
    assert.equal(result.causalChains[0].chainType, 'DISTRIBUTION_TO_CONTINUITY_RISK');
    assert.equal(result.continuityRiskImpact, 'RISCO_DIRETO_VINCULADO');
  });

  it('should establish CORRECTIVE_ACTION_TO_RECOVERY', () => {
    const input = mockInput([mockDecision('COST_CUTTING', 100, 3)]);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    
    assert.equal(result.causalChains[0].chainType, 'CORRECTIVE_ACTION_TO_RECOVERY');
    assert.equal(result.fcoImpactAssessment, 'ESTABILIZADO');
    assert.equal(result.runwayImpactAssessment, 'ESTABILIZADO');
  });

  it('should handle NO_ESTABLISHED_CHAIN for decisions with no recognized negative pattern', () => {
    const input = mockInput([mockDecision('STRATEGIC_EXPANSION', 100, 5)]);
    const result = DecisionToCashCausalityEngine.evaluate(input);
    
    assert.equal(result.causalChains[0].chainType, 'NO_ESTABLISHED_CHAIN');
    assert.equal(result.causalChains[0].confidence, 'LOW_CONFIDENCE_ASSOCIATION');
  });

});
