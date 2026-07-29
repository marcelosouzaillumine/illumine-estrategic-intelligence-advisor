import { describe, it, expect } from 'vitest';
import { ExecutiveExperienceComposer } from '@illumine/executive-experience-composer';

describe('@illumine/intelligence (Wave 17.11 Canonical Composition Verification)', () => {
  it('should compose 4 native intelligence layers via ExecutiveExperienceComposer (ADR-065)', () => {
    const res = ExecutiveExperienceComposer.compose({
      companyId: 'comp-100',
      userId: 'user-ceo',
      pageId: 'DREPage',
      period: '2026'
    });

    expect(res.decisionView.opportunityTitle).toBeDefined();
    expect(res.metricInsights.length).toBeGreaterThan(0);
    expect(res.actions.length).toBeGreaterThan(0);
    expect(res.copilotOpening.greetingText).toContain('DRE');
  });
});
