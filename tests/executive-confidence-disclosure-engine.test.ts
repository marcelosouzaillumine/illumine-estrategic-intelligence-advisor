// tests/executive-confidence-disclosure-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ExecutiveConfidenceDisclosureEngine } from '../src/lib/executive-confidence-disclosure-engine';

describe('ExecutiveConfidenceDisclosureEngine', () => {
  it('must rigorously expose confidence, memory, and conflict metrics', () => {
    const mockReasoning: any = {
      supportingEvidence: [{}, {}, {}], // 3 items
      supportingMemories: [{}], // 1 item
      identifiedConflicts: [], // 0 items
      confidence: { level: 'HIGH' },
      relevantTopics: ['RISKS', 'GOVERNANCE']
    };

    const traceability = ExecutiveConfidenceDisclosureEngine.generateTraceability(mockReasoning);

    assert.strictEqual(traceability.evidenceCount, 3);
    assert.strictEqual(traceability.memoryCount, 1);
    assert.strictEqual(traceability.conflictCount, 0);
    assert.strictEqual(traceability.confidenceLevel, 'HIGH');
    assert.deepStrictEqual(traceability.sourceTopics, ['RISKS', 'GOVERNANCE']);
  });
});
