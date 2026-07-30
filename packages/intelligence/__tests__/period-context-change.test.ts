/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';

describe('@illumine/intelligence (Wave 18.1 Period Context Change)', () => {
  it('should generate different narratives when period changes (ADR-068)', () => {
    const res2025 = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-1',
      companyName: 'Empresa Alpha',
      pageId: 'DREPage',
      period: '2025',
      comparisonPeriod: '2024'
    });

    const res2026 = ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId: 'comp-1',
      companyName: 'Empresa Alpha',
      pageId: 'DREPage',
      period: '2026',
      comparisonPeriod: '2025'
    });

    expect(res2025.narrative.executiveHeadline).toContain('2025');
    expect(res2026.narrative.executiveHeadline).toContain('2026');
    expect(res2025.narrative.executiveHeadline).not.toEqual(res2026.narrative.executiveHeadline);
  });
});
