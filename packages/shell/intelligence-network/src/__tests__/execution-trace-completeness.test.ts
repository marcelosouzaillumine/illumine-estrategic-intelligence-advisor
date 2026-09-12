/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { IntelligenceNetworkOrchestrationEngine } from '../index';

describe('Quality Gate 3 — Execution Trace Completeness Test', () => {
  it('should generate an end-to-end execution chain trace across context, policy, routing and observability', () => {
    const orchestration = IntelligenceNetworkOrchestrationEngine.orchestrateNetwork('empresa-trace-check', 'FINANCIAL');

    expect(orchestration.status).toBe('ORCHESTRATED_SUCCESS');
    expect(orchestration.observabilityTrace.executionChain).toContain('ExecutiveContextAssembler');
    expect(orchestration.observabilityTrace.executionChain).toContain('ExecutivePolicyEngine');
    expect(orchestration.observabilityTrace.executionChain).toContain('GovernanceRoutingEngine');
    expect(orchestration.observabilityTrace.wisdomAppliedCount).toBeGreaterThan(0);
  });
});
