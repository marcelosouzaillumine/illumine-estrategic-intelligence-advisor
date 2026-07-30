/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveWelcomeOrchestrator } from '../index';

describe('Quality Gate 9 — Workspace Regression Test', () => {
  it('should deliver full identity contracts without regression', () => {
    const welcome = ExecutiveWelcomeOrchestrator.buildWelcomeExperience('usr-full', 'CEO', 'CLIENT');

    expect(welcome.identity).toBeDefined();
    expect(welcome.legacy).toBeDefined();
    expect(welcome.relationship).toBeDefined();
    expect(welcome.celebration).toBeDefined();
    expect(welcome.purposeStatementText).toBeDefined();
  });
});
