import { describe, it, expect } from 'vitest';
import { ExecutiveCopilotEngine } from '../index';

describe('@illumine/executive-copilot (Wave 17 Phase 2 Executive Copilot Layer)', () => {
  it('should answer contextual C-Level question with primary cause, evidence, and consulted agents (ADR-050)', () => {
    const response = ExecutiveCopilotEngine.answerContextualQuestion('Por que o EBITDA caiu?', 'FINANCE');

    expect(response.consultedAgents).toContain('cfo-governance-agent');
    expect(response.evidenceSummaries.length).toBeGreaterThan(0);
    expect(response.confidenceScore.value).toBe(94);
  });
});
