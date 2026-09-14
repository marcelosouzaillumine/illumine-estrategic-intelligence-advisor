// tests/institutional-operational-governance.test.ts

import { test } from 'node:test';
import assert from 'node:assert';
import { InstitutionalOperationalGovernanceRuntime } from '../src/capabilities/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

test('Institutional Operational Governance Runtime', async (t) => {
  await t.test('should return UNVERIFIABLE capability confidence if historical cycles are insufficient', () => {
    const report = {
      metadata: { historicalCyclesCount: 1, lineageHash: 'abc-123' },
      metrics: {
        financialMetrics: { ocf: 0, revenue: 0 },
        scaleEfficiency: { ebitdaGrowth: 0, recGrowth: 0 }
      }
    } as unknown as ExecutiveIntelligenceReport;

    const result = InstitutionalOperationalGovernanceRuntime.evaluate(report, []);
    assert.strictEqual(result.executionIntegrity.capabilityConfidence, 'UNVERIFIABLE');
    assert.strictEqual(result.executionIntegrity.status, 'EXECUTION_STABLE');
    assert.strictEqual(result.frictions.length, 0);
  });

  await t.test('should detect friction when growing revenue without cash conversion', () => {
    const report = {
      metadata: { historicalCyclesCount: 3, lineageHash: 'def-456' },
      metrics: {
        financialMetrics: { ocf: -1000, revenue: 5000 },
        scaleEfficiency: { ebitdaGrowth: -0.15, recGrowth: 0.20 }
      },
      capitalStructure: { rolloverRisk: 'LOW' },
      executiveCommand: { activeDirectives: [] }
    } as unknown as ExecutiveIntelligenceReport;

    const result = InstitutionalOperationalGovernanceRuntime.evaluate(report, []);
    assert.ok(result.frictions.length > 0);
    const growthFriction = result.frictions.find(f => f.causalMetrics.includes('revenueGrowth'));
    assert.ok(growthFriction);
    assert.strictEqual(growthFriction?.nature, 'EXPANSION_RELATED');
  });

  await t.test('should detect execution strain when expanding under survival mode or expansion suspension', () => {
    const report = {
      metadata: { historicalCyclesCount: 5, lineageHash: 'ghi-789' },
      survivalReport: { activeSurvivalMode: 'SURVIVAL_MODE' },
      executiveCommand: {
        activeDirectives: [{ category: 'EXPANSION_SUSPENSION' }]
      },
      metrics: {
        financialMetrics: { ocf: -500, revenue: 10000 },
        scaleEfficiency: { ebitdaGrowth: 0.20, recGrowth: 0.25 }
      },
      capitalStructure: { rolloverRisk: 'HIGH' }
    } as unknown as ExecutiveIntelligenceReport;

    const result = InstitutionalOperationalGovernanceRuntime.evaluate(report, ['EXECUTION_PRESSURED']);
    assert.strictEqual(result.executionIntegrity.status, 'EXECUTION_UNDER_COORDINATION_STRAIN');
    assert.strictEqual(result.strategicAlignment.isAligned, false);
    assert.ok(result.strategicAlignment.tensions.length > 0);
    assert.strictEqual(result.thesis.institutionalPosture, 'RESTRICTED_EXECUTION');
  });

  await t.test('should trigger Operational Stability Guard to cushion rapid transition', () => {
    const report = {
      metadata: { historicalCyclesCount: 5, lineageHash: 'jkl-012' },
      executiveCommand: {
        activeDirectives: [{ category: 'EXPANSION_SUSPENSION' }]
      },
      metrics: {
        financialMetrics: { ocf: 500, revenue: 10000 },
        scaleEfficiency: { ebitdaGrowth: 0.20, recGrowth: 0.20 }
      }
    } as unknown as ExecutiveIntelligenceReport;

    // Simulate jumping straight from STABLE
    const result = InstitutionalOperationalGovernanceRuntime.evaluate(report, ['EXECUTION_STABLE']);
    assert.strictEqual(result.executionIntegrity.status, 'EXECUTION_PRESSURED'); // buffered from STRAIN
    assert.ok(result.executionIntegrity.strainFactors.includes('Atrito amortecido pelo Guardião de Estabilidade (Transição Moderada).'));
  });
});
