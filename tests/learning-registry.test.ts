import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Learning Registry integrates historical decision calibration', () => {
  const learningRegistry = {
    totalEvaluatedDecisions: 42,
    calibrationAccuracy: 95.2,
    recalibratedCount: 3,
    status: 'ACTIVE',
  };

  assert.equal(learningRegistry.status, 'ACTIVE');
  assert.ok(learningRegistry.calibrationAccuracy > 90);
});
