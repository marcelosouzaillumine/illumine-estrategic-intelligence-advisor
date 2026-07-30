/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveClosingQuestionEngine } from '../index';

describe('Quality Gate 15 — Mandatory Closing Question Test', () => {
  it('should end every briefing with an actionable C-Level question per role', () => {
    const clientQ = ExecutiveClosingQuestionEngine.generateClosingQuestion('CLIENT');
    expect(clientQ).toContain('Qual dessas prioridades você deseja resolver primeiro hoje?');

    const advQ = ExecutiveClosingQuestionEngine.generateClosingQuestion('ADVISOR');
    expect(advQ).toContain('Qual cliente você deseja atender primeiro');
  });
});
