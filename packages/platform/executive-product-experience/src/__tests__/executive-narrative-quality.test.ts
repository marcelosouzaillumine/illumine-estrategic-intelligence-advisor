/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveNarrativeEngine } from '../index';

describe('Quality Gate 1 — Executive Narrative Quality Test', () => {
  it('should translate technical metrics into executive narratives with appropriate tone', () => {
    const narrative = ExecutiveNarrativeEngine.translateToExecutiveNarrative('Liquidez Corrente', 0.89);

    expect(narrative.technicalMetricName).toBe('Liquidez Corrente');
    expect(narrative.executiveNarrativeText).toContain('pressão de liquidez');
    expect(narrative.tone).toBe('WARNING');
  });
});
