// tests/executive-timeline.test.ts

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ExecutiveTimelineEngine } from '../src/workspace/runtime/executive-timeline/ExecutiveTimelineEngine';
import { HistoricalRuntimeCycle } from '../src/workspace/runtime/executive-timeline/executive-timeline-types';

describe('Executive Timeline Engine (ETE) v1.0', () => {

  const getBaseCycle = (ref: string): HistoricalRuntimeCycle => ({
    cycleReference: ref,
    compositeScore: 70,
    ebitda: 200000,
    netIncome: 100000,
    ocf: 150000,
    cashEquivalents: 300000,
    equity: 1000000,
    totalDebt: 500000,
    workingCapital: 100000,
    fiduciaryClassification: 'HEALTHY',
    lineageHash: `hash_${ref}`,
    isQuarantined: false,
    isRestricted: false
  });

  describe('Trajectory and Acceleration Classification', () => {
    it('Scenario A: Improving Trajectory and Positive Acceleration', () => {
      // Scores: 60 -> 72 -> 88 (constantly improving and acceleration is positive: (88-72)=16 > (72-60)=12)
      const c1 = { ...getBaseCycle('2025'), compositeScore: 60 };
      const c2 = { ...getBaseCycle('2026-Q1'), compositeScore: 72 };
      const c3 = { ...getBaseCycle('2026-Q2'), compositeScore: 88 };

      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [c1, c2] }, c3);

      assert.strictEqual(output.trajectoryClassification, 'IMPROVING');
      assert.strictEqual(output.accelerationState, 'POSITIVE_ACCELERATION');
      assert.strictEqual(output.confidenceLevel, 'MEDIUM_CONFIDENCE'); // 3 cycles
      assert.ok(output.executiveNarrative.includes('IMPROVING'));
    });

    it('Scenario B: Recovery Trajectory', () => {
      // Scores: 80 -> 60 -> 72 (dip and rebound: 72 > 60 but 60 < 80)
      const c1 = { ...getBaseCycle('2025'), compositeScore: 80 };
      const c2 = { ...getBaseCycle('2026-Q1'), compositeScore: 60 };
      const c3 = { ...getBaseCycle('2026-Q2'), compositeScore: 72 };

      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [c1, c2] }, c3);

      assert.strictEqual(output.trajectoryClassification, 'RECOVERING');
      assert.strictEqual(output.accelerationState, 'POSITIVE_ACCELERATION'); // speed increased from -20 to +12
    });

    it('Scenario C: Structural Deterioration', () => {
      // Scores: 85 -> 70 -> 50 (drop of 35 >= 25)
      const c1 = { ...getBaseCycle('2025'), compositeScore: 85 };
      const c2 = { ...getBaseCycle('2026-Q1'), compositeScore: 70 };
      const c3 = { ...getBaseCycle('2026-Q2'), compositeScore: 50 };

      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [c1, c2] }, c3);

      assert.strictEqual(output.trajectoryClassification, 'STRUCTURALLY_DETERIORATING');
      assert.strictEqual(output.accelerationState, 'NEGATIVE_ACCELERATION'); // (50-70)=-20 < (70-85)=-15
    });

    it('Stable Plateau Trajectory', () => {
      // Scores: 70 -> 71 -> 72 (variance <= 5 points)
      const c1 = { ...getBaseCycle('2025'), compositeScore: 70 };
      const c2 = { ...getBaseCycle('2026-Q1'), compositeScore: 71 };
      const c3 = { ...getBaseCycle('2026-Q2'), compositeScore: 72 };

      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [c1, c2] }, c3);

      assert.strictEqual(output.trajectoryClassification, 'PLATEAUED');
    });
  });

  describe('Fiduciary Event and Inflection Detection', () => {
    it('Scenario E: Constitutional Restriction and Quarantine triggers Inflections & Events', () => {
      const c1 = getBaseCycle('2025');
      const c2 = { ...getBaseCycle('2026-Q1'), isQuarantined: true };
      const c3 = getBaseCycle('2026-Q2');

      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [c1, c2] }, c3);

      assert.strictEqual(output.trajectoryClassification, 'PLATEAUED'); // latest cycle c3 is healthy, scores are 70 -> 70 -> 70
      
      // Let's make c3 quarantined to verify.
      const c3Q = { ...getBaseCycle('2026-Q2'), isQuarantined: true };
      const outputQ = ExecutiveTimelineEngine.generate({ historicalCycles: [c1, c2] }, c3Q);
      assert.strictEqual(outputQ.trajectoryClassification, 'CONSTITUTIONALLY_RESTRICTED');
      assert.strictEqual(outputQ.confidenceLevel, 'FAIL_CLOSED');
      assert.ok(outputQ.timelineEvents.some(e => e.eventType === 'CONSTITUTIONAL_RESTRICTION'));
    });

    it('EBITDA Inflection and Debt Acceleration Events', () => {
      // EBITDA goes from 200k -> -50k. TotalDebt goes from 500k -> 600k (+20% >= 15%)
      const c1 = { ...getBaseCycle('2025'), ebitda: 200000, totalDebt: 500000 };
      const c2 = { ...getBaseCycle('2026-Q1'), ebitda: -50000, totalDebt: 610000 };
      const c3 = { ...getBaseCycle('2026-Q2'), ebitda: -60000, totalDebt: 610000 };

      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [c1, c2] }, c3);

      const events = output.timelineEvents;
      assert.ok(events.some(e => e.eventType === 'EBITDA_INFLECTION'));
      assert.ok(events.some(e => e.eventType === 'DEBT_ACCELERATION'));

      const inflections = output.inflectionPoints;
      // EBITDA change: -50k vs 200k -> change of -250k / 200k = -125% >= 15%
      assert.ok(inflections.some(ip => ip.metricName === 'ebitda'));
      // Debt change: 610k vs 500k -> change of +22% >= 15%
      assert.ok(inflections.some(ip => ip.metricName === 'totalDebt'));
    });
  });

  describe('Scenario D: Broken Historical Continuity & Low Cycle Count', () => {
    it('Should degrade confidence and flag FAIL_CLOSED when under 2 cycles', () => {
      const c1 = getBaseCycle('2025');
      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [] }, c1);

      assert.strictEqual(output.confidenceLevel, 'FAIL_CLOSED');
      assert.strictEqual(output.trajectoryClassification, 'INSUFFICIENT_EVIDENCE');
    });

    it('Should degrade confidence to LOW_CONFIDENCE when exactly 2 cycles', () => {
      const c1 = getBaseCycle('2025');
      const c2 = getBaseCycle('2026');
      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [c1] }, c2);

      assert.strictEqual(output.confidenceLevel, 'LOW_CONFIDENCE');
      assert.strictEqual(output.trajectoryClassification, 'INSUFFICIENT_EVIDENCE');
    });

    it('Should trigger FAIL_CLOSED when lineage is broken', () => {
      const c1 = { ...getBaseCycle('2025'), lineageHash: 'broken_link' };
      const c2 = getBaseCycle('2026-Q1');
      const c3 = getBaseCycle('2026-Q2');

      const output = ExecutiveTimelineEngine.generate({ historicalCycles: [c1, c2] }, c3);
      assert.strictEqual(output.confidenceLevel, 'FAIL_CLOSED');
    });
  });
});
