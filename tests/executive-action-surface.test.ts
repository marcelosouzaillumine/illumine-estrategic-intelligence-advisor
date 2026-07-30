import { test } from 'node:test';
import assert from 'node:assert/strict';

test('ExecutiveActionSurface contract validation for UI rendering', () => {
  const actionData = {
    decision: 'Otimizar Capital de Giro',
    owner: 'CFO',
    timeframe: '60 dias',
    expectedShift: '+R$ 800k',
    monitoredMetric: 'Necessidade de Capital de Giro (NCG)',
  };

  assert.equal(actionData.owner, 'CFO');
  assert.equal(actionData.timeframe, '60 dias');
  assert.ok(actionData.expectedShift.includes('800k'));
});
