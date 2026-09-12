import { describe, it, expect } from 'vitest';
import { ExecutiveExplainabilityCenter } from '../index';

describe('@illumine/executive-explainability (Wave 16.5 Phase 4 Executive Explainability Center)', () => {
  it('should generate complete DecisionExplanation detailing indicators, agents and discarded alternatives (ADR-044)', () => {
    const explanation = ExecutiveExplainabilityCenter.explainDecision(
      'Reestruturação exigida por variação cambial',
      ['USD_BRL', 'NET_DEBT'],
      ['cfo-agent', 'risk-agent'],
      ['Câmbio médio de R$ 5,20']
    );

    expect(explanation.keyIndicators).toContain('USD_BRL');
    expect(explanation.discardedAlternatives.length).toBeGreaterThan(0);
    expect(explanation.confidenceScore.value).toBe(95);
  });
});
