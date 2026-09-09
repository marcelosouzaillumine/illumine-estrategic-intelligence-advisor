import { describe, it, expect } from 'vitest';
import { ExecutiveAgentExecutionRuntime } from '@illumine/executive-page-intelligence';

describe('@illumine/governance (Wave 17.9 Executive Agent Execution Runtime)', () => {
  it('should execute complete agent journey returning 5-layer response (ADR-062)', () => {
    const res = ExecutiveAgentExecutionRuntime.executeAction('cfo-governance-agent', 'Analisar resultado', 'DREPage');

    expect(res.layer1Summary).toBeDefined();
    expect(res.layer2Evidences.length).toBeGreaterThan(0);
    expect(res.layer3Reasoning).toBeDefined();
    expect(res.layer4Recommendation).toBeDefined();
    expect(res.layer5NextActionSteps.length).toBeGreaterThan(0);
    expect(res.confidenceScore).toBe(96);
  });
});
