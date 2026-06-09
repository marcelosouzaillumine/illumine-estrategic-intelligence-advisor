// tests/governance-copilot-memory-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { GovernanceCopilotMemoryEngine } from '../src/lib/governance-copilot-memory-engine';

describe('GovernanceCopilotMemoryEngine', () => {
  it('must return empty array on undefined input', () => {
    const memories = GovernanceCopilotMemoryEngine.resolveMemories(undefined as any, ['RISKS']);
    assert.deepStrictEqual(memories, []);
  });

  it('must extract relevant memory events', () => {
    const input: any = {
      governanceMemory: {
        events: [
          { eventId: 'EV-1', relatedTopics: ['RISKS'], description: 'Risk escalated' }
        ]
      }
    };
    const memories = GovernanceCopilotMemoryEngine.resolveMemories(input, ['RISKS']);
    assert.strictEqual(memories.length, 1);
    assert.strictEqual(memories[0].memoryId, 'EV-1');
  });
});
