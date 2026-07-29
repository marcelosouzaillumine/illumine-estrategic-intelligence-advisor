import { describe, it, expect } from 'vitest';
import { ExecutivePageIntelligenceAdapter, PageAgentResolver } from '../index';

describe('@illumine/executive-page-intelligence (Wave 17.6 Phase 1 Page Intelligence Adapter)', () => {
  it('should create unified page context connecting existing agents (ADR-059)', () => {
    const pageContext = ExecutivePageIntelligenceAdapter.createPageContext('DREPage', 'Financial', 'CEO', ['EBITDA', 'NET_INCOME']);

    expect(pageContext.pageId).toBe('DREPage');
    expect(pageContext.userPersona).toBe('CEO');
    expect(pageContext.availableAgents).toContain('cfo-intelligence-agent');
  });

  it('should resolve capabilities for executive pages', () => {
    const capabilities = ExecutivePageIntelligenceAdapter.getPageCapabilities('DREPage');

    expect(capabilities.hasInsightsHeader).toBe(true);
    expect(capabilities.hasDrawer).toBe(true);
    expect(capabilities.hasCopilot).toBe(true);
  });
});
