import test from 'node:test';
import assert from 'node:assert';
import { InstitutionalScenarioEngine } from '../../src/core/runtime/predictive-governance/InstitutionalScenarioEngine';
import { InstitutionalSnapshot } from '../../src/core/runtime/predictive-governance/PredictiveTypes';
import { TrajectoryOutput } from '../../src/core/runtime/predictive-governance/InstitutionalTrajectoryEngine';

test('▶ Institutional Scenario Golden Tests', async (t) => {
  await t.test('✔ 1. Projects scenarios based on trajectory', () => {
    const snapshots: InstitutionalSnapshot[] = [
      { id: '1', timestamp: '2026-01-01', governanceScore: 50, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 },
      { id: '2', timestamp: '2026-02-01', governanceScore: 55, cescfScore: 55, bpHealth: 55, dfcHealth: 55, dreHealth: 55, esgMaturity: 55 }
    ];
    
    const trajectory: TrajectoryOutput = {
      trajectoryScore: 80,
      trajectoryDirection: 'IMPROVING',
      confidenceLevel: 'LOW',
      confidenceReason: '',
      causalExplanation: ''
    };

    const result = InstitutionalScenarioEngine.projectScenarios(snapshots, trajectory);
    
    const base = result.scenarios.find(s => s.type === 'BASE');
    const accelerated = result.scenarios.find(s => s.type === 'ACELERADO');
    const conservative = result.scenarios.find(s => s.type === 'CONSERVADOR');

    // Current governance = 55. IMPROVING delta = +5.
    assert.strictEqual(base?.projectedGovernanceScore, 60);
    assert.strictEqual(accelerated?.projectedGovernanceScore, 65);
    assert.strictEqual(conservative?.projectedGovernanceScore, 57);
  });
});
