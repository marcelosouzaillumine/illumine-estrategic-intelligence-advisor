/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveSignalEngine, ExecutiveAwarenessEngine } from '../index';

describe('Quality Gate 5 — Explainability Test', () => {
  it('should guarantee every signal contains explainability justification text and non-action consequence', () => {
    const raw = ExecutiveAwarenessEngine.observeEventStream('empresa-demo');
    const signals = ExecutiveSignalEngine.convertEventsToSignals(raw);

    signals.forEach((sig) => {
      expect(sig.explainabilityJustificationText).toBeDefined();
      expect(sig.nonActionConsequenceText).toBeDefined();
    });
  });
});
