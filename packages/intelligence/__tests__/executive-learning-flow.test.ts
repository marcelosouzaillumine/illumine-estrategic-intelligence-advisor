/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';

describe('@illumine/governance (Wave 18.2 Executive Learning Flow)', () => {
  it('should preserve decision context traceability for learning feedback loop (ADR-076)', () => {
    const res = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-learning',
      companyName: 'Empresa Aprendizagem',
      pageId: 'DREPage',
      period: '2026'
    });

    expect(res.context.companyId).toBe('comp-learning');
    expect(res.context.confidenceLevel).toBeGreaterThanOrEqual(95.0);
  });
});
