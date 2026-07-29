import { describe, it, expect } from 'vitest';
import { ExecutiveInsightsLayer, ExecutiveInsightResolver } from '../index';

describe('@illumine/executive-insights-layer (Wave 17.5 Phase 1 Executive Insights Layer)', () => {
  it('should resolve header insight summary for current page context (ADR-055)', () => {
    const summary = ExecutiveInsightsLayer.renderHeaderSummary('FinancialPage');

    expect(summary.pageContext).toBe('FinancialPage');
    expect(summary.opportunities.length).toBeGreaterThan(0);
    expect(summary.risks.length).toBeGreaterThan(0);
    expect(summary.recommendedDecisions.length).toBeGreaterThan(0);
    expect(summary.confidence.value).toBe(95);
  });
});
