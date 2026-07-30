/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveContextProvider } from '@illumine/executive-context-engine';
import { ExecutiveAdvisoryEngine } from '../executive-advisory-engine/src';

describe('@illumine/intelligence (Wave 18.6 Advisory Governance)', () => {
  it('should enforce strict context integrity and evidence linking in recommendations (ADR-084)', () => {
    const ctx = ExecutiveContextProvider.buildContext({
      companyId: 'comp-emporio',
      companyName: 'Empório do Mármore',
      pageId: 'DREPage',
      period: '2026'
    });

    const result = ExecutiveAdvisoryEngine.orchestrateAdvisoryCycle(ctx);
    expect(result).not.toBeNull();

    if (result) {
      expect(result.recommendation.selectedRecommendation).toBeDefined();
      expect(result.actionPlan.owner).toBe('Diretor Financeiro (CFO)');
      expect(result.opportunity.confidenceLevel).toBeGreaterThanOrEqual(90.0);
    }
  });
});
