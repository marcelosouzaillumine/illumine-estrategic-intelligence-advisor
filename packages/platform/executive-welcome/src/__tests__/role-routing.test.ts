/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveWelcomeOrchestrator } from '../index';

describe('Quality Gate 7 — Role Routing Test', () => {
  it('should orchestrate appropriate welcome experience per role', () => {
    const boardWelcome = ExecutiveWelcomeOrchestrator.buildWelcomeExperience('u-01', 'Conselheiro', 'BOARD');
    expect(boardWelcome.briefing.headlineText).toContain('Conselho');

    const partnerWelcome = ExecutiveWelcomeOrchestrator.buildWelcomeExperience('u-02', 'Parceiro', 'PARTNER');
    expect(partnerWelcome.briefing.headlineText).toContain('Pipeline');
  });
});
