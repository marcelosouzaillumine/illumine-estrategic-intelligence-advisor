/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveCompanionOrchestrator } from '../index';

describe('Quality Gate 7 — Advisor Companion Test', () => {
  it('should build portfolio companion view for advisor role', () => {
    const companion = ExecutiveCompanionOrchestrator.buildCompanionExperience('adv-1', 'Dr. Eduardo', 'ADVISOR');

    expect(companion.role).toBe('ADVISOR');
    expect(companion.executiveProfileName).toBe('Dr. Eduardo');
  });
});
