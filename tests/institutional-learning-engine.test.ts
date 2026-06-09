import { describe, it } from 'node:test';
import assert from 'node:assert';
import { discoverLearningPatterns } from '../src/lib/institutional-learning-engine';
import { InstitutionalOutcomeRecord } from '../src/lib/institutional-outcomes-types';

describe('Institutional Learning Engine', () => {
  it('should discover a bottleneck when insights are high but decisions are low', () => {
    const records: InstitutionalOutcomeRecord[] = [
      { id: '1', level: 'E1', source: 'SYSTEM_RUNTIME', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' },
      { id: '2', level: 'E1', source: 'SYSTEM_RUNTIME', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' },
      { id: '3', level: 'E1', source: 'SYSTEM_RUNTIME', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' },
      { id: '4', level: 'E1', source: 'SYSTEM_RUNTIME', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' }
    ];

    const patterns = discoverLearningPatterns(records);
    
    assert.ok(patterns.length > 0);
    assert.strictEqual(patterns[0].type, 'EXECUTION_FAILURE');
  });

  it('should discover a transformation driver when actions map successfully to measured results', () => {
    const records: InstitutionalOutcomeRecord[] = [
      { id: '1', level: 'E4', source: 'ACTION_PLAN', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' },
      { id: '2', level: 'E6', source: 'MANAGEMENT_REPORT', sourceReference: '', description: '', dateLogged: '', category: 'STRATEGY' }
    ];

    const patterns = discoverLearningPatterns(records);
    
    const driver = patterns.find(p => p.type === 'TRANSFORMATION_DRIVER');
    assert.ok(driver !== undefined);
  });
});
