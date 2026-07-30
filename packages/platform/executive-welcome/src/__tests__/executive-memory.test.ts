/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveMemoryEngine } from '../index';

describe('Quality Gate 14 — Executive Memory Test', () => {
  it('should recall previous decision summary and follow-up prompt', () => {
    const memory = ExecutiveMemoryEngine.recallPreviousContext();

    expect(memory.previousDecisionSummary).toBeDefined();
    expect(memory.promptFollowUpText).toContain('Há 3 dias iniciamos o plano');
  });
});
