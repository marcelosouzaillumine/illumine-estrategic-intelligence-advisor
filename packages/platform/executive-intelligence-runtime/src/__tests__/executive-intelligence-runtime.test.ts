import { describe, it, expect } from 'vitest';
import { ExecutiveIntelligenceRuntime } from '../index';

describe('@illumine/executive-intelligence-runtime (Wave 17.7 Phase 1 Executive Intelligence UI Runtime)', () => {
  it('should resolve page runtime, insights and available actions without creating new agents (ADR-060)', () => {
    const runtime = ExecutiveIntelligenceRuntime.resolvePageRuntime('DREPage', 'Financial', 'CEO');

    expect(runtime.pageContext).toBe('DREPage');
    expect(runtime.activeAgents).toContain('cfo-intelligence-agent');
    expect(runtime.availableActions.length).toBeGreaterThan(0);
    expect(runtime.insights.confidence.value).toBe(95);
  });
});
