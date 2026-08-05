import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveMemoryTriggerEngine } from '../ExecutiveMemoryTriggerEngine';

describe('ExecutiveMemoryTriggerEngine', () => {
  let engine: ExecutiveMemoryTriggerEngine;

  beforeEach(() => {
    engine = new ExecutiveMemoryTriggerEngine();
  });

  it('should trigger memories based on temporal review dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday

    const memories: any[] = [{
      content: 'Revisar expansão',
      lifecycle: { status: 'ACTIVE', reviewDate: pastDate.toISOString() }
    }];

    const triggered = engine.evaluateTriggers(memories, { eventType: 'TEMPORAL_REVIEW', topic: '', payload: {} });
    expect(triggered.length).toBe(1);
  });
});
