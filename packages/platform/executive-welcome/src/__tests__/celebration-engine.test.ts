/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveMissionEngine } from '../index';

describe('Quality Gate 8 — Celebration Engine Test', () => {
  it('should deliver daily mission and target outcome celebration', () => {
    const mission = ExecutiveMissionEngine.generateMission('CLIENT');

    expect(mission.dailyMissionText).toBeDefined();
    expect(mission.targetOutcome).toContain('EBITDA Preservado');
  });
});
