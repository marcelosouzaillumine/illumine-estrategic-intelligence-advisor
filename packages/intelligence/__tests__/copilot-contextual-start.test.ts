import { describe, it, expect } from 'vitest';
import { CopilotContextResolver } from '@illumine/executive-copilot';

describe('@illumine/intelligence (Wave 17.10 Copilot Contextual Start Verification)', () => {
  it('should verify copilot resolves active context with page, user, company and kpi', () => {
    const ctx = CopilotContextResolver.resolveActiveContext('DREPage', 'EBITDA', 'ins-10', 'Revisar custos');

    expect(ctx.currentPage).toBe('DREPage');
    expect(ctx.activeMetric).toBe('EBITDA');
    expect(ctx.activeInsightId).toBe('ins-10');
  });
});
