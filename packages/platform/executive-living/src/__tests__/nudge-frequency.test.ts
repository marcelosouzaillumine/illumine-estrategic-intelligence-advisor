/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveNudgeEngine } from '../index';

describe('Quality Gate 7 — Nudge Frequency Test', () => {
  it('should enforce a maximum of 3 discreet nudges per day', () => {
    const nudges = ExecutiveNudgeEngine.generateDiscreetNudges('empresa-demo');

    expect(nudges.length).toBeLessThanOrEqual(3);
    expect(nudges[0].priorityRank).toBe(1);
  });
});
