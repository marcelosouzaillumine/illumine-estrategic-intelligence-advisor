// tests/governance-copilot-evidence-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { GovernanceCopilotEvidenceEngine } from '../src/lib/governance-copilot-evidence-engine';

describe('GovernanceCopilotEvidenceEngine', () => {
  it('must return empty array on undefined input', () => {
    const evidence = GovernanceCopilotEvidenceEngine.resolveEvidence(undefined as any, ['RISKS']);
    assert.deepStrictEqual(evidence, []);
  });

  it('must extract IOD E3-E6 level evidence when topic is OUTCOMES', () => {
    const input: any = {
      institutionalOutcomes: {
        records: [
          { id: 'REC-1', level: 'E3', description: 'desc' },
          { id: 'REC-2', level: 'E1', description: 'desc2' } // Should be ignored
        ]
      }
    };
    const evidence = GovernanceCopilotEvidenceEngine.resolveEvidence(input, ['OUTCOMES']);
    assert.strictEqual(evidence.length, 1);
    assert.strictEqual(evidence[0].evidenceId, 'REC-1');
  });
});
