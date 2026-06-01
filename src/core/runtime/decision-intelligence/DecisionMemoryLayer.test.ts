import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { DecisionMemoryLayer } from './DecisionMemoryLayer';
import { ExecutiveDecisionEvent, DecisionCategory } from './InstitutionalDecisionTypes';
import { FiduciaryDecisionTimeline } from './FiduciaryDecisionTimeline';

function mockDecision(type: DecisionCategory, fco: number, runway: number, risk: boolean = false): ExecutiveDecisionEvent {
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
    recurrenceFlag: false,
    fiduciaryRiskFlag: risk
  };
}

describe('DecisionMemoryLayer', () => {

  it('should fail-closed if there are no registered events', () => {
    const result = DecisionMemoryLayer.evaluate([]);
    assert.equal(result.recurringDecisionPatterns.length, 0);
    assert.ok(result.decisionMemoryWarnings[0].includes('Ausência de eventos decisórios estruturados'));
    assert.equal(result.institutionalLearningSignal, 'NOT_AVAILABLE');
  });

  it('should detect recurrent inventory expansion with runway drop as destructive', () => {
    const decisions = [
      mockDecision('INVENTORY_EXPANSION', -100, -2, false),
      mockDecision('INVENTORY_EXPANSION', -150, -3, true)
    ];
    
    const result = DecisionMemoryLayer.evaluate(decisions);
    assert.ok(result.recurringDecisionPatterns.includes('INVENTORY_EXPANSION'));
    assert.equal(result.destructiveDecisionRecurrence, true);
    assert.equal(result.institutionalLearningSignal, 'NEGATIVE');
    assert.ok((result.decisionDisciplineScore as number) < 50);
  });

  it('should flag recurrent emergency capitalization and warn about it', () => {
    const decisions = [
      mockDecision('EMERGENCY_CAPITALIZATION', 500, 10, true),
      mockDecision('EMERGENCY_CAPITALIZATION', 600, 8, true)
    ];
    
    const result = DecisionMemoryLayer.evaluate(decisions);
    assert.ok(result.recurringDecisionPatterns.includes('EMERGENCY_CAPITALIZATION'));
    assert.ok(result.decisionMemoryWarnings.some(w => w.includes('Recorrência crônica de capitalização emergencial')));
  });

  it('should detect commercial growth with negative FCO as destructive if runway drops', () => {
    const decisions = [
      mockDecision('CUSTOMER_CREDIT_EXPANSION', -50, -1, false),
      mockDecision('STRATEGIC_EXPANSION', -200, -2, true)
    ];
    
    const result = DecisionMemoryLayer.evaluate(decisions);
    assert.equal(result.destructiveDecisionRecurrence, true);
    assert.equal(result.institutionalLearningSignal, 'NEGATIVE');
  });

  it('should identify corrective decision that improves runway (positive learning)', () => {
    const decisions = [
      mockDecision('COST_CUTTING', 100, 5, false),
      mockDecision('OPERATIONAL_RESTRUCTURING', 200, 10, false)
    ];
    
    const result = DecisionMemoryLayer.evaluate(decisions);
    assert.equal(result.correctiveDecisionEvidence, true);
    assert.equal(result.destructiveDecisionRecurrence, false);
    assert.equal(result.institutionalLearningSignal, 'POSITIVE');
    assert.ok((result.decisionDisciplineScore as number) > 50);
  });

});

describe('FiduciaryDecisionTimeline', () => {

  it('should map decisions chronologically and determine causality correctly', () => {
    const decisions = [
      mockDecision('EMERGENCY_CAPITALIZATION', 100, 5, true), // Alivio temporario
      mockDecision('INVENTORY_EXPANSION', -50, -2, false)     // Deterioracao direta
    ];

    const timeline = FiduciaryDecisionTimeline.extract(decisions);
    assert.equal(timeline.length, 2);
    
    assert.equal(timeline[0].decision, 'EMERGENCY_CAPITALIZATION');
    assert.equal(timeline[0].causalRelation, 'Alívio temporário ou artificial de liquidez');
    assert.equal(timeline[1].decision, 'INVENTORY_EXPANSION');
    assert.equal(timeline[1].causalRelation, 'Deterioração direta de FCO e Runway');
  });

});
