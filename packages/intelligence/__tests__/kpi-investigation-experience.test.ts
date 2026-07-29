import { describe, it, expect } from 'vitest';
import { KPIQuestionResolver } from '@illumine/contextual-kpi-intelligence';

describe('@illumine/intelligence (Wave 17.10 KPI Investigation Experience)', () => {
  it('should verify strategic KPIs support interactive investigation questions', () => {
    const questions = KPIQuestionResolver.getKPIQuestions('NET_MARGIN');

    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toContain('NET_MARGIN');
  });
});
