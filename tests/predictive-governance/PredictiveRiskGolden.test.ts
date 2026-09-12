import test from 'node:test';
import assert from 'node:assert';
import { PredictiveRiskEngine, EmergingRiskCategory } from '../../src/capabilities/runtime/predictive-governance/PredictiveRiskEngine';
import { InstitutionalSnapshot } from '../../src/capabilities/runtime/predictive-governance/PredictiveTypes';

test('▶ Predictive Risk Golden Tests', async (t) => {
  await t.test('✔ 1. Detects emerging LIQUIDITY_RISK over 3 consecutive cycles', () => {
    const snapshots: InstitutionalSnapshot[] = [
      { id: '1', timestamp: '2026-01-01', governanceScore: 80, cescfScore: 80, bpHealth: 80, dfcHealth: 80, dreHealth: 80, esgMaturity: 80 },
      { id: '2', timestamp: '2026-02-01', governanceScore: 80, cescfScore: 80, bpHealth: 80, dfcHealth: 70, dreHealth: 80, esgMaturity: 80 },
      { id: '3', timestamp: '2026-03-01', governanceScore: 80, cescfScore: 80, bpHealth: 80, dfcHealth: 60, dreHealth: 80, esgMaturity: 80 }
    ];
    const result = PredictiveRiskEngine.evaluateRisks(snapshots);
    assert.strictEqual(result.confidenceLevel, 'MODERATE'); // 3 cycles
    assert.strictEqual(result.emergingRisks.some(r => r.category === EmergingRiskCategory.LIQUIDITY_RISK), true);
  });

  await t.test('✔ 2. Ignores isolated drops (false positives)', () => {
    const snapshots: InstitutionalSnapshot[] = [
      { id: '1', timestamp: '2026-01-01', governanceScore: 80, cescfScore: 80, bpHealth: 80, dfcHealth: 80, dreHealth: 80, esgMaturity: 80 },
      { id: '2', timestamp: '2026-02-01', governanceScore: 80, cescfScore: 80, bpHealth: 80, dfcHealth: 50, dreHealth: 80, esgMaturity: 80 }, // Sudden drop
      { id: '3', timestamp: '2026-03-01', governanceScore: 80, cescfScore: 80, bpHealth: 80, dfcHealth: 70, dreHealth: 80, esgMaturity: 80 }  // Recovery
    ];
    const result = PredictiveRiskEngine.evaluateRisks(snapshots);
    // Should be empty because it did not deteriorate consecutively
    assert.strictEqual(result.emergingRisks.some(r => r.category === EmergingRiskCategory.LIQUIDITY_RISK), false);
  });
});
