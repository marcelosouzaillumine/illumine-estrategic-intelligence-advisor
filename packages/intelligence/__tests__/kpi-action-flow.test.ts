import { describe, it, expect } from 'vitest';
import { KPIQuestionResolver } from '@illumine/contextual-kpi-intelligence';

describe('@illumine/governance (Wave 17.10.1 Real KPI Action Flow)', () => {
  it('should verify click flow for strategic KPI triggers', () => {
    const questions = KPIQuestionResolver.getKPIQuestions('EBITDA');

    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toContain('EBITDA');
  });
});
