import { describe, it, expect } from 'vitest';
import { ExecutiveIntelligenceDrawer, InsightExplorer, EvidencePanel, RecommendationPanel } from '../index';

describe('@illumine/executive-intelligence-drawer (Wave 17.5 Phase 2 Persistent Drawer)', () => {
  it('should open persistent drawer keeping page context and active filters (ADR-056)', () => {
    const state = ExecutiveIntelligenceDrawer.open('FinancialPage', { year: '2026' });

    expect(state.isOpen).toBe(true);
    expect(state.pageContext).toBe('FinancialPage');
    expect(state.preservedFilters.year).toBe('2026');

    const insights = InsightExplorer.getInsights('FinancialPage');
    const evidences = EvidencePanel.getEvidences('FinancialPage');
    const recommendations = RecommendationPanel.getRecommendations('FinancialPage');

    expect(insights.length).toBeGreaterThan(0);
    expect(evidences.length).toBeGreaterThan(0);
    expect(recommendations.length).toBeGreaterThan(0);
  });
});
