import { describe, it, expect } from 'vitest';
import { ExecutiveIntelligenceRuntime } from '../index';

describe('@illumine/executive-governance-runtime (Wave 17.7 Phase 1 Executive Governance UI Runtime)', () => {
  it('should resolve page runtime, insights and available actions without creating new agents (ADR-060)', () => {
    const runtime = ExecutiveIntelligenceRuntime.resolvePageRuntime('DREPage', 'Financial', 'CEO');

    expect(runtime.pageContext).toBe('DREPage');
    expect(runtime.activeAgents).toContain('cfo-governance-agent');
    expect(runtime.availableActions.length).toBeGreaterThan(0);
    expect(runtime.insights.confidence.value).toBe(95);
  });
});
