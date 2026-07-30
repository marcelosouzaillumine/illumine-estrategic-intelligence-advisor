/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveExperienceScoreEngine } from '../index';

describe('Quality Gate 3 — Executive Experience Score Test', () => {
  it('should calculate EES metrics and time-to-understanding telemetry', () => {
    const ees = ExecutiveExperienceScoreEngine.calculateEES('empresa-ees-check');

    expect(ees.eesOverallScore).toBeGreaterThan(90);
    expect(ees.timeToUnderstandingSeconds).toBeLessThan(60); // Menos de 1 minuto para entender
    expect(ees.executionRatePercent).toBeGreaterThan(80);
  });
});
