import { describe, it, expect } from 'vitest';
import { ExecutiveAgentExecutionRuntime } from '@illumine/executive-page-intelligence';

describe('@illumine/governance (Wave 17.10.1 Real Agent Interaction Flow)', () => {
  it('should execute real agent interaction returning 5-layer executive response on click', () => {
    const res = ExecutiveAgentExecutionRuntime.executeAction('cfo-governance-agent', 'Explicar variação', 'DREPage');

    expect(res.layer1Summary).toBeDefined();
    expect(res.layer2Evidences.length).toBeGreaterThan(0);
    expect(res.layer4Recommendation).toBeDefined();
  });
});
