/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveIdentityEngine } from '../index';

describe('Quality Gate 1 — Executive Identity Test', () => {
  it('should build executive identity narrative answering who this executive is becoming', () => {
    const identity = ExecutiveIdentityEngine.buildIdentityNarrative('Marcelo');

    expect(identity.monthsInJourney).toBe(14);
    expect(identity.financialCycleDaysReduced).toBe(31);
    expect(identity.totalDecisionsConductedCount).toBe(287);
    expect(identity.legacyNarrativeText).toContain('continuar esse trabalho');
  });
});
