/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveWelcomeOrchestrator } from '../index';

describe('Quality Gate 19 — Legacy Continuity Test', () => {
  it('should deliver complete identity and legacy contracts in orchestrator', () => {
    const welcome = ExecutiveWelcomeOrchestrator.buildWelcomeExperience('u-leg', 'Marcelo', 'CLIENT');

    expect(welcome.identity).toBeDefined();
    expect(welcome.advisorLegacy).toBeDefined();
    expect(welcome.renewalProbabilityPercent).toBe(98.0);
  });
});
