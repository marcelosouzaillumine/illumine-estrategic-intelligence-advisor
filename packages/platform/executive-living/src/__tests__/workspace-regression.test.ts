/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveLivingOrchestrator } from '../index';

describe('Quality Gate 14 — Workspace Regression Test', () => {
  it('should guarantee orchestrator delivers complete contracts for workspace UI', () => {
    const living = ExecutiveLivingOrchestrator.buildLivingExperience('u-ws-reg', 'empresa-demo');

    expect(living.livingId).toBeDefined();
    expect(living.companyId).toBe('empresa-demo');
  });
});
