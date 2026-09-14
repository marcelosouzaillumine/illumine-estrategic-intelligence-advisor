import { describe, it, expect } from 'vitest';
import { ExecutiveExperienceComposer } from '../executive-experience-composer/src';

describe('@illumine/governance (Wave 17.11 Canonical Composition Verification)', () => {
  it('should compose 4 native governance layers via ExecutiveExperienceComposer (ADR-065)', () => {
    const res = ExecutiveExperienceComposer.compose({
      companyId: 'comp-1',
      userId: 'user-1',
      pageId: 'DREPage',
      period: '2026'
    });

    expect(res.decisionView.opportunityTitle).toBeDefined();
    expect(res.metricInsights.length).toBeGreaterThan(0);
    expect(res.actions.length).toBeGreaterThan(0);
    expect(res.copilotOpening.greetingText).toContain('2026');
  });
});
