/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveCompanionOrchestrator } from '../index';

describe('Quality Gate 13 — Executive Companion Workspace Test', () => {
  it('should deliver full companion experience for workspace rendering', () => {
    const companion = ExecutiveCompanionOrchestrator.buildCompanionExperience('u-ws', 'Marcelo', 'CLIENT');

    expect(companion.companionId).toBeDefined();
    expect(companion.executiveProfileName).toBe('Marcelo');
  });
});
