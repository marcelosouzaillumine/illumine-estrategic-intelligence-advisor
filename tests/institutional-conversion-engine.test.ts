import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateConversionMetrics } from '../src/lib/institutional-conversion-engine';
import { InstitutionalOutcomeRecord } from '../src/lib/institutional-outcomes-types';

describe('Institutional Conversion Engine', () => {
  it('should correctly calculate conversion rates for a full chain', () => {
    const records: InstitutionalOutcomeRecord[] = [
      { id: '1', level: 'E1', source: 'SYSTEM_RUNTIME', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' },
      { id: '2', level: 'E1', source: 'SYSTEM_RUNTIME', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' },
      { id: '3', level: 'E3', source: 'BOARD_MINUTES', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' },
      { id: '4', level: 'E4', source: 'ACTION_PLAN', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' }
    ];

    const metrics = calculateConversionMetrics(records);
    
    assert.strictEqual(metrics.totalInsights, 2);
    assert.strictEqual(metrics.totalDecisions, 1);
    assert.strictEqual(metrics.totalActions, 1);
    
    assert.strictEqual(metrics.insightToDecisionRate, 0.5);
    assert.strictEqual(metrics.decisionToActionRate, 1);
    assert.strictEqual(metrics.actionToOutcomeRate, 0);
  });
});
