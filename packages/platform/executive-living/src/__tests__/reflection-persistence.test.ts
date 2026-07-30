/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveReflectionEngine } from '../index';

describe('Quality Gate 8 — Reflection Persistence Test', () => {
  it('should deliver daily reflection contract persisted into wisdom', () => {
    const reflection = ExecutiveReflectionEngine.buildDailyReflection();

    expect(reflection.isPersistedInWisdom).toBe(true);
    expect(reflection.primaryDecisionQuestionText).toBeDefined();
  });
});
