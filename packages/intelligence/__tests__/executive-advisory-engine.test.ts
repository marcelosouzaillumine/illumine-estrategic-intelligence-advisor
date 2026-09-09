/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';
import { ExecutiveAdvisoryEngine } from '../executive-advisory-engine/src';

describe('@illumine/governance (Wave 18.6 Executive Advisory Engine)', () => {
  it('should execute full advisory cycle from context to opportunity, recommendation, simulation and action plan', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-100',
      companyName: 'Granatum S.A.',
      pageId: 'DREPage',
      period: '2026'
    });

    const result = ExecutiveAdvisoryEngine.orchestrateAdvisoryCycle(ctx);
    expect(result).not.toBeNull();

    if (result) {
      expect(result.opportunity.companyId).toBe('comp-100');
      expect(result.priorityScore).toBeGreaterThan(0);
      expect(result.recommendation.alternatives.length).toBe(2);
      expect(result.simulatedScenarios.length).toBe(4);
      expect(result.actionPlan.owner).toBeDefined();
    }
  });
});
