import { describe, it, expect } from 'vitest';
import { CopilotContextResolver, ExecutiveCopilotExperience } from '@illumine/executive-copilot';

describe('@illumine/intelligence (Wave 17.6 Phase 6 Executive Copilot Activation)', () => {
  it('should process copilot prompt with active page and metric context', () => {
    const activeCtx = CopilotContextResolver.resolveActiveContext('DREPage', 'EBITDA', 'ins-01', 'Revisar custos');
    const response = ExecutiveCopilotExperience.processUserPrompt('Explique melhor', activeCtx);

    expect(response.primaryCause).toContain('EBITDA');
    expect(response.consultedAgents).toContain('cfo-intelligence-agent');
    expect(response.confidenceScore.value).toBe(95);
  });
});
