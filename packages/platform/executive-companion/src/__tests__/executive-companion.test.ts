/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveCompanionEngine } from '../index';

describe('Quality Gate 1 — Executive Companion Test', () => {
  it('should resolve companion profile answering who this executive is today', () => {
    const profile = ExecutiveCompanionEngine.resolveCompanionProfile('Marcelo');

    expect(profile.executiveProfileName).toBe('Marcelo');
    expect(profile.currentMomentumLevel).toBe('EXCEPTIONAL');
    expect(profile.leadershipGrowthScore).toBe(94.5);
  });
});
