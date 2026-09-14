import { describe, it, expect } from 'vitest';
import { KPIQuestionResolver } from '@illumine/contextual-kpi-intelligence';

describe('@illumine/governance (Wave 17.8 Phase 6 KPI Interaction Verification)', () => {
  it('should resolve interactive questions for strategic KPIs', () => {
    const questions = KPIQuestionResolver.getKPIQuestions('EBITDA');
    expect(questions.length).toBe(5);
    expect(questions[0]).toContain('EBITDA');
  });
});
