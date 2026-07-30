/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveBriefingEngine } from '../index';

describe('Quality Gate 3 — Advisor Briefing Test', () => {
  it('should generate portfolio briefing for ADVISOR role', () => {
    const briefing = ExecutiveBriefingEngine.generateBriefing('ADVISOR');

    expect(briefing.role).toBe('ADVISOR');
    expect(briefing.headlineText).toContain('Qual cliente precisa mais de mim hoje?');
  });
});
