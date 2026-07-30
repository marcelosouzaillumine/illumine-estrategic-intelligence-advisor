/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveBriefingEngine } from '../index';

describe('Quality Gate 2 — Executive Briefing Quality Test', () => {
  it('should generate executive briefing with headline and context for CLIENT', () => {
    const briefing = ExecutiveBriefingEngine.generateBriefing('CLIENT');

    expect(briefing.role).toBe('CLIENT');
    expect(briefing.headlineText).toContain('decisões mais importantes');
    expect(briefing.operationalStatus).toBe('ATTENTION_REQUIRED');
  });
});
