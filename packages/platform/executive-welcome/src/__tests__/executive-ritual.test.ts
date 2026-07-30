/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveRitualEngine } from '../index';

describe('Quality Gate 12 — Executive Ritual Test', () => {
  it('should build Executive Daily Briefing and Advisor Daily Ritual sequence', () => {
    const execRitual = ExecutiveRitualEngine.buildRitual('CLIENT');
    expect(execRitual.ritualName).toBe('Executive Daily Briefing™');

    const advRitual = ExecutiveRitualEngine.buildRitual('ADVISOR');
    expect(advRitual.ritualName).toBe('Advisor Daily Ritual™');
    expect(advRitual.revenuePreservedFormatted).toBe('R$ 12,4 milhões');
  });
});
