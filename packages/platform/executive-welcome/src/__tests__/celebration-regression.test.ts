/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveCelebrationEngine } from '../index';

describe('Quality Gate 6 — Celebration Regression Test', () => {
  it('should detect milestones and generate celebration contracts', () => {
    const celebration = ExecutiveCelebrationEngine.detectCelebrations();

    expect(celebration.isCelebrated).toBe(true);
    expect(celebration.titleText).toContain('280+ Decisões Registradas');
  });
});
