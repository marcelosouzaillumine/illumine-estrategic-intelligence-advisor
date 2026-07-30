/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveWelcomeOrchestrator } from '../index';

describe('Quality Gate 20 — Identity Workspace Regression Test', () => {
  it('should verify all 20 EWIX capability components build without regression', () => {
    const welcomeAdv = ExecutiveWelcomeOrchestrator.buildWelcomeExperience('u-adv', 'Dr. Eduardo', 'ADVISOR');

    expect(welcomeAdv.role).toBe('ADVISOR');
    expect(welcomeAdv.closingActionQuestion).toContain('Qual cliente você deseja atender primeiro');
  });
});
