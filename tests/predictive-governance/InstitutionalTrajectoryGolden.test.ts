import test from 'node:test';
import assert from 'node:assert';
import { InstitutionalTrajectoryEngine } from '../../src/capabilities/runtime/predictive-governance/InstitutionalTrajectoryEngine';
import { InstitutionalSnapshot } from '../../src/capabilities/runtime/predictive-governance/PredictiveTypes';

test('▶ Institutional Trajectory Golden Tests', async (t) => {
  await t.test('✔ 1. Returns INSUFFICIENT_HISTORY with less than 2 cycles', () => {
    const snapshots: InstitutionalSnapshot[] = [
      { id: '1', timestamp: '2026-01-01', governanceScore: 50, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 }
    ];
    const result = InstitutionalTrajectoryEngine.calculateTrajectory(snapshots);
    assert.strictEqual(result.confidenceLevel, 'INSUFFICIENT_HISTORY');
    assert.strictEqual(result.trajectoryDirection, 'STABLE');
  });

  await t.test('✔ 2. Detects IMPROVING trajectory with sufficient history', () => {
    const snapshots: InstitutionalSnapshot[] = [
      { id: '1', timestamp: '2026-01-01', governanceScore: 50, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 },
      { id: '2', timestamp: '2026-02-01', governanceScore: 55, cescfScore: 50, bpHealth: 55, dfcHealth: 55, dreHealth: 50, esgMaturity: 50 }
    ];
    const result = InstitutionalTrajectoryEngine.calculateTrajectory(snapshots);
    assert.strictEqual(result.trajectoryDirection, 'IMPROVING');
    assert.strictEqual(result.confidenceLevel, 'LOW'); // Only 2 cycles
  });

  await t.test('✔ 3. Detects DETERIORATING trajectory with HIGH confidence', () => {
    const snapshots: InstitutionalSnapshot[] = [
      { id: '1', timestamp: '2026-01-01', governanceScore: 80, cescfScore: 80, bpHealth: 80, dfcHealth: 80, dreHealth: 80, esgMaturity: 80 },
      { id: '2', timestamp: '2026-02-01', governanceScore: 70, cescfScore: 75, bpHealth: 70, dfcHealth: 70, dreHealth: 70, esgMaturity: 70 },
      { id: '3', timestamp: '2026-03-01', governanceScore: 60, cescfScore: 70, bpHealth: 60, dfcHealth: 60, dreHealth: 60, esgMaturity: 60 },
      { id: '4', timestamp: '2026-04-01', governanceScore: 50, cescfScore: 65, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 }
    ];
    const result = InstitutionalTrajectoryEngine.calculateTrajectory(snapshots);
    assert.strictEqual(result.trajectoryDirection, 'DETERIORATING');
    assert.strictEqual(result.confidenceLevel, 'HIGH'); // 4 cycles
  });
});
