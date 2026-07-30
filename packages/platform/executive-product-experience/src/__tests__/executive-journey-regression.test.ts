/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveJourneyEngine } from '../index';

describe('Quality Gate 4 — Executive Journey Regression Test', () => {
  it('should enforce sequence compliance across the executive journey stages', () => {
    const journey = ExecutiveJourneyEngine.getActiveJourney('empresa-jrn-check');

    expect(journey.currentStage).toBe('UNDERSTAND');
    expect(journey.stageProgressPercent).toBe(40.0);
    expect(journey.nextRequiredAction).toBeDefined();
  });
});
