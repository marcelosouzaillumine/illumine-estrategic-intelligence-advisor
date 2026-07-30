/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { AdvisorPulseEngine } from '../index';

describe('Quality Gate 10 — Advisor Pulse Test', () => {
  it('should deliver aggregated portfolio daily pulse for advisor role', () => {
    const pulse = AdvisorPulseEngine.generateAdvisorPulse('Dr. Eduardo');

    expect(pulse.activePortfolioCount).toBe(18);
    expect(pulse.criticalClientsCount).toBe(1);
    expect(pulse.recommendedAgenda.length).toBeGreaterThan(0);
  });
});
