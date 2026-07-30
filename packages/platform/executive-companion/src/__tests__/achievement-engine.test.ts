/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { OrganizationalAchievementEngine } from '../index';

describe('Quality Gate 4 — Achievement Engine Test', () => {
  it('should detect achievements and suggest next organizational milestones', () => {
    const achievements = OrganizationalAchievementEngine.detectAchievements('empresa-demo', false);

    expect(achievements.length).toBe(3);
    expect(achievements[0].isSimulatedBenchmark).toBe(true);
    expect(achievements[1].valueCreatedFormatted).toBe('R$ 4.800.000,00');
  });
});
