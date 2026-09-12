// tests/institutional-resilience/institutional-resilience.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { InstitutionalResilienceEngine } from '../../src/capabilities/runtime/institutional-resilience/InstitutionalResilienceEngine';
import { ResilienceEvaluationInput } from '../../src/capabilities/runtime/institutional-resilience/ResilienceTypes';

describe('Institutional Resilience & Antifragility Engine (IRAE)', () => {

  it('1. Should fail-closed without sufficient history (Classification <= STRUCTURALLY_STABLE)', () => {
    const input: ResilienceEvaluationInput = {
      longitudinalRuntimeHistory: [{}], // Only 1 cycle
      fco: 1000,
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 24 } }
    };
    
    const result = InstitutionalResilienceEngine.evaluate(input);
    assert.strictEqual(result.resilienceClassification, 'STRUCTURALLY_STABLE');
    assert.strictEqual(result.confidenceLevel, 'LOW');
    assert.strictEqual(result.antifragilityValidated, false);
  });

  it('2. Should identify INSTITUTIONALLY_FRAGILE when vulnerability is high despite history', () => {
    const input: ResilienceEvaluationInput = {
      longitudinalRuntimeHistory: [{}, {}, {}],
      fco: -500, // Negative FCO
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 3 } }, // Critical runway
      fiduciaryOutput: { patrimonialIntegrityStatus: 'SEVERELY_ERODED' }
    };
    
    const result = InstitutionalResilienceEngine.evaluate(input);
    assert.strictEqual(result.resilienceClassification, 'INSTITUTIONALLY_FRAGILE');
    assert.ok(result.vulnerabilityReductionScore < 40);
  });

  it('3. Should detect false resilience (e.g. artificial cash runway without FCO)', () => {
    const input: ResilienceEvaluationInput = {
      longitudinalRuntimeHistory: [{}, {}, {}],
      fco: -100, // Operating loss
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 36 } }, // High runway due to external funding
    };
    
    const result = InstitutionalResilienceEngine.evaluate(input);
    assert.strictEqual(result.falseResilienceDetected, true);
    assert.strictEqual(result.resilienceClassification, 'INSTITUTIONALLY_FRAGILE');
    assert.strictEqual(result.antifragilityValidated, false);
  });

  it('4. Should validate RESILIENT classification with solid metrics and history', () => {
    const input: ResilienceEvaluationInput = {
      longitudinalRuntimeHistory: [
        { fco: 50, survivalModeActive: false },
        { fco: 100, survivalModeActive: false },
        { fco: 150, survivalModeActive: false }
      ],
      fco: 200,
      availableCash: 5000,
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 18 } },
      treasuryRuntime: { severity: 'STABLE' },
      fiduciaryOutput: { patrimonialIntegrityStatus: 'PRESERVED' }
    };
    
    const result = InstitutionalResilienceEngine.evaluate(input);
    assert.ok(['RESILIENT', 'ADAPTIVE'].includes(result.resilienceClassification));
    assert.strictEqual(result.falseResilienceDetected, false);
  });

  it('5. Should upgrade to ANTIFRAGILE if sufficient adaptation after a past crisis', () => {
    const input: ResilienceEvaluationInput = {
      longitudinalRuntimeHistory: [
        { fco: -100, survivalModeActive: true, treasurySeverity: 'CRITICAL', availableCash: 100 }, // Past crisis
        { fco: 100, survivalModeActive: false, treasurySeverity: 'STABLE', availableCash: 500 },
        { fco: 200, survivalModeActive: false, treasurySeverity: 'STABLE', availableCash: 1000 }
      ],
      fco: 300,
      availableCash: 2000,
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 36 } },
      treasuryRuntime: { severity: 'STABLE' },
      fiduciaryOutput: { patrimonialIntegrityStatus: 'PRESERVED' }
    };
    
    const result = InstitutionalResilienceEngine.evaluate(input);
    // Score should be high enough for ADAPTIVE, and past crisis upgrades it to ANTIFRAGILE
    assert.strictEqual(result.resilienceClassification, 'ANTIFRAGILE');
    assert.strictEqual(result.antifragilityValidated, true);
    assert.strictEqual(result.governanceEvolutionStatus, 'IMPROVED');
  });

  it('6. Should deny ANTIFRAGILE and cap at ADAPTIVE if no past crisis (survivalModeActive) occurred', () => {
    const input: ResilienceEvaluationInput = {
      longitudinalRuntimeHistory: [
        { fco: 100, survivalModeActive: false, treasurySeverity: 'STABLE', availableCash: 100 }, 
        { fco: 150, survivalModeActive: false, treasurySeverity: 'STABLE', availableCash: 500 },
        { fco: 200, survivalModeActive: false, treasurySeverity: 'STABLE', availableCash: 1000 }
      ],
      fco: 300,
      availableCash: 2000,
      cashIntelligenceRuntime: { continuityRisk: { projectedRunwayMonths: 36 } },
      treasuryRuntime: { severity: 'STABLE' },
      fiduciaryOutput: { patrimonialIntegrityStatus: 'PRESERVED' }
    };
    
    const result = InstitutionalResilienceEngine.evaluate(input);
    assert.strictEqual(result.resilienceClassification, 'ADAPTIVE');
    assert.strictEqual(result.antifragilityValidated, true); // Score high, but lacks crisis history to be fully ANTIFRAGILE
  });

});
