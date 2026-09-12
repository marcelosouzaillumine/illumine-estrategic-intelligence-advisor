import { describe, it, expect } from 'vitest';
import { ExecutiveQuestionEngine } from '../index';

describe('@illumine/executive-question-engine (Wave 17 Phase 5 Executive Question Engine)', () => {
  it('should generate 4 recommended investigative questions for metric deviation (ADR-052)', () => {
    const questions = ExecutiveQuestionEngine.generateRecommendedQuestions('EBITDA_MARGIN');

    expect(questions.length).toBe(4);
    expect(questions[0].category).toBe('Diagnostic');
    expect(questions[1].category).toBe('Strategic');
    expect(questions[2].category).toBe('Operational');
    expect(questions[3].category).toBe('Impact');
  });
});
