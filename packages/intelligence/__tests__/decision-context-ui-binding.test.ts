/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';

describe('@illumine/intelligence (Wave 18.2 Decision Context UI Binding)', () => {
  it('should bind decision output directly from ExecutiveDecisionContext without page identity lock', () => {
    const res = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-alpha',
      companyName: 'Alpha Tech',
      pageId: 'CustomExecutivePage',
      period: '2026'
    });

    expect(res.context.companyName).toBe('Alpha Tech');
    expect(res.signal.signalTitle).toContain('Alpha Tech');
  });
});
