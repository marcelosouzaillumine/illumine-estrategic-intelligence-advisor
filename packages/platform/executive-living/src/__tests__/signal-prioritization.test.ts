/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveSignalEngine, ExecutiveAwarenessEngine } from '../index';

describe('Quality Gate 4 — Signal Prioritization Test', () => {
  it('should assign priority scores and urgency levels to executive signals', () => {
    const raw = ExecutiveAwarenessEngine.observeEventStream('empresa-demo');
    const signals = ExecutiveSignalEngine.convertEventsToSignals(raw);

    const importantSignal = signals.find((s) => s.severity === 'IMPORTANT');
    expect(importantSignal).toBeDefined();
    expect(importantSignal?.priorityScore).toBe(85);
  });
});
