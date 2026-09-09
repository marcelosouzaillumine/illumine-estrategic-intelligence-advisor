// tests/institutional-strategic-intelligence.test.ts

import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalStrategicIntelligenceRuntime } from '../src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Institutional Strategic Governance Runtime', () => {

  const createBaseReport = (): any => ({
    metadata: { lineageHash: 'TEST-HASH', historicalCyclesCount: 5 },
    institutionalContext: { tenantId: 'test-tenant', currentCycle: '2026-05' },
    capitalStructure: { fundingDependenceLevel: 'MODERATE', rolloverRisk: 'LOW' },
    metrics: {
      financialMetrics: { ocf: 500, revenue: 10000 },
      scaleEfficiency: { recGrowth: 0.10, ebitdaGrowth: 0.12 }
    },
    resilienceReport: { status: 'SAFE', continuityResilienceStatus: 'SAFE' },
    treasuryIntelligenceReport: { stressStatus: 'STABLE' },
    operatingPressureReport: { structuralPressureSeverity: 'LOW' },
    executiveCommand: { activeDirectives: [] },
    operationalGovernance: {
      executionIntegrity: { status: 'EXECUTION_STABLE' }
    }
  });

  it('1. Detects EXPANSION_POSTURE and RECURRENT_GROWTH when expanding sustainably', () => {
    const report = createBaseReport();
    const result = InstitutionalStrategicIntelligenceRuntime.evaluate(report);

    assert.strictEqual(result.posture, 'EXPANSION_POSTURE');
    assert.strictEqual(result.vectors[0].direction, 'RECURRENT_GROWTH');
    assert.strictEqual(result.expansionSustainability.isSustainable, true);
    assert.strictEqual(result.capitalAlignment.isCoherent, true);
    assert.strictEqual(result.trajectory, 'TRAJECTORY_STABLE');
    assert.strictEqual(result.contradictions.length, 0);
  });

  it('2. Detects STRATEGIC CONTRADICTION: Expansion under Survival Mode', () => {
    const report = createBaseReport();
    // Forcing Expansion under Survival Mode
    report.survivalReport = { activeSurvivalMode: 'SURVIVAL_MODE' };
    
    const result = InstitutionalStrategicIntelligenceRuntime.evaluate(report);
    
    // As per the engine, if survival mode is active AND it's expanding, it triggers a contradiction.
    assert.strictEqual(result.posture, 'RESTRICTION_POSTURE');
    assert.strictEqual(result.contradictions.length, 1);
    assert.strictEqual(result.contradictions[0].type, 'CONTINUITY_STRATEGY_TENSION');
    assert.strictEqual(result.trajectory, 'TRAJECTORY_UNSTABLE'); // Due to CRITICAL contradiction
  });

  it('3. Fail-Closed behavior: Requires at least 2 historical cycles', () => {
    const report = createBaseReport();
    report.metadata.historicalCyclesCount = 1;
    
    const result = InstitutionalStrategicIntelligenceRuntime.evaluate(report);
    
    assert.strictEqual(result.posture, 'UNVERIFIABLE_POSTURE');
    assert.strictEqual(result.vectors[0].vectorConfidence, 'UNVERIFIABLE');
    assert.strictEqual(result.contradictions.length, 0);
    assert.strictEqual(result.capitalAlignment.status, 'ALIGNED');
    assert.strictEqual(result.trajectory, 'TRAJECTORY_STABLE'); // Fallback is stable
  });

});
