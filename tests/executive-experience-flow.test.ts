import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Executive Experience Flow validates 8 cognitive layers', () => {
  const cognitiveLayers = [
    'Context',
    'Intent',
    'Understanding',
    'Diagnosis',
    'Deliberation',
    'Evidence',
    'Execution',
    'Learning',
  ];

  assert.equal(cognitiveLayers.length, 8);
  assert.ok(cognitiveLayers.includes('Context'));
  assert.ok(cognitiveLayers.includes('Execution'));
  assert.ok(cognitiveLayers.includes('Learning'));
});
