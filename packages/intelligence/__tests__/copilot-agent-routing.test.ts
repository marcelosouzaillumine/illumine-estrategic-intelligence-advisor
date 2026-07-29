import { describe, it, expect } from 'vitest';
import { ExecutiveCopilotRouter } from '@illumine/executive-copilot';

describe('@illumine/intelligence (Wave 17.9 Executive Copilot Agent Routing)', () => {
  it('should route user prompt to specific executive agent based on context (Fase 6)', () => {
    const route1 = ExecutiveCopilotRouter.routePrompt('Quais são os riscos no balanço?', 'BalançoPatrimonialPage');
    expect(route1.targetAgentId).toBe('financial-risk-agent');

    const route2 = ExecutiveCopilotRouter.routePrompt('Simular corte de despesas', 'DREPage');
    expect(route2.targetAgentId).toBe('strategic-simulation-agent');
  });
});
