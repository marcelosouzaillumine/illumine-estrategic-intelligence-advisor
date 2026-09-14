import test from 'node:test';
import assert from 'node:assert';
import { GovernanceMomentumEngine } from '../../src/capabilities/runtime/predictive-governance/GovernanceMomentumEngine';
import { InstitutionalSnapshot } from '../../src/capabilities/runtime/predictive-governance/PredictiveTypes';

test('▶ Governance Momentum Golden Tests', async (t) => {
  await t.test('✔ 1. Detects ACCELERATING momentum', () => {
    const snapshots: InstitutionalSnapshot[] = [
      { id: '1', timestamp: '2026-01-01', governanceScore: 50, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 },
      { id: '2', timestamp: '2026-02-01', governanceScore: 52, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 }, // +2
      { id: '3', timestamp: '2026-03-01', governanceScore: 60, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 }  // +8 -> Acceleration
    ];
    const result = GovernanceMomentumEngine.calculateMomentum(snapshots);
    assert.strictEqual(result.momentumDirection, 'ACCELERATING');
  });

  await t.test('✔ 2. Detects DECELERATING momentum', () => {
    const snapshots: InstitutionalSnapshot[] = [
      { id: '1', timestamp: '2026-01-01', governanceScore: 50, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 },
      { id: '2', timestamp: '2026-02-01', governanceScore: 60, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 }, // +10
      { id: '3', timestamp: '2026-03-01', governanceScore: 62, cescfScore: 50, bpHealth: 50, dfcHealth: 50, dreHealth: 50, esgMaturity: 50 }  // +2 -> Deceleration
    ];
    const result = GovernanceMomentumEngine.calculateMomentum(snapshots);
    assert.strictEqual(result.momentumDirection, 'DECELERATING');
  });
});
