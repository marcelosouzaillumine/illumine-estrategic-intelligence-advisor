/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';

describe('@illumine/intelligence (Wave 18.1 Agent Context Binding)', () => {
  it('should bind agent execution exclusively to ExecutiveDecisionContext without page identity (ADR-068)', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-200',
      companyName: 'TechCorp',
      pageId: 'CustomPage',
      period: '2026',
      financialData: { EBITDA: 1800000, ReceitaBruta: 12000000 }
    });

    const res = ExecutiveDecisionIntelligenceEngine.evaluate(ctx);

    expect(res.context.companyName).toBe('TechCorp');
    expect(res.recommendation.recommendationText).toContain('TechCorp');
    expect(res.actions.length).toBeGreaterThan(0);
  });
});
