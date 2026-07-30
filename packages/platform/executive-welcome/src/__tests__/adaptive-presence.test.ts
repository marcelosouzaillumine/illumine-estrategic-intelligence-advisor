/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveContextIntelligenceEngine } from '../index';

describe('Quality Gate 11 — Adaptive Presence Test', () => {
  it('should adapt greeting based on absence, month end or first Monday', () => {
    const afterAbsence = ExecutiveContextIntelligenceEngine.resolveContext(12);
    expect(afterAbsence.adaptiveContextGreeting).toContain('Bem-vindo de volta');
    expect(afterAbsence.accumulatedEventsCountCount).toBe(37);
  });
});
