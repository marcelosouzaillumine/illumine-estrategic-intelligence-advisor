/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveCompanionEngine } from '../index';

describe('Quality Gate 10 — Growth Score Test', () => {
  it('should deliver executive leadership growth score above baseline', () => {
    const profile = ExecutiveCompanionEngine.resolveCompanionProfile('Marcelo');

    expect(profile.leadershipGrowthScore).toBe(94.5);
  });
});
