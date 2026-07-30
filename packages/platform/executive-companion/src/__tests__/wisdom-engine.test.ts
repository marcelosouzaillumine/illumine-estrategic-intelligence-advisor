/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveWisdomEngine } from '../index';

describe('Quality Gate 5 — Wisdom Engine Test', () => {
  it('should extract wisdom cards with empirical evidence and historical success rates', () => {
    const wisdom = ExecutiveWisdomEngine.extractWisdom();

    expect(wisdom.length).toBe(3);
    expect(wisdom[0].historicalSuccessRatePercent).toBe(94.0);
    expect(wisdom[1].corePatternTitle).toContain('Conselho');
  });
});
