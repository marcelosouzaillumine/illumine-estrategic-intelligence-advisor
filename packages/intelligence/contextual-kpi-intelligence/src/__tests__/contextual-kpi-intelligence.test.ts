import { describe, it, expect } from 'vitest';
import { KPIIntelligenceTrigger, KPIExplanationEngine, KPIQuestionResolver } from '../index';

describe('@illumine/contextual-kpi-governance (Wave 17.5 Phase 4 KPI Explanation Engine)', () => {
  it('should deliver 3-layer executive response standard for strategic metric (ADR-058)', () => {
    const explanation = KPIIntelligenceTrigger.triggerForKPI('EBITDA', 1420000);

    expect(explanation.summary).toContain('EBITDA'); // Layer 1 (Summary)
    expect(explanation.evidences.length).toBeGreaterThan(0); // Layer 2 (Evidences)
    expect(explanation.recommendations.length).toBeGreaterThan(0); // Layer 3 (Recommendations)

    const questions = KPIQuestionResolver.getKPIQuestions('EBITDA');
    expect(questions.length).toBe(5);
  });
});
