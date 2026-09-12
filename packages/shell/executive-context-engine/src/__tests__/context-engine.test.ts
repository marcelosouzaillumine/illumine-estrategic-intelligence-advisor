import { describe, it, expect } from 'vitest';
import { ExecutiveContextEngine } from '../index';

describe('@illumine/executive-context-engine (Wave 17 Phase 3 Complete Context Engine)', () => {
  it('should resolve unified executive governance context across 5 vectors (ADR-051)', () => {
    const context = ExecutiveContextEngine.resolveContext('CEO', 'DashboardPage', 'FINANCE', ['EBITDA', 'NET_DEBT']);

    expect(context.userPersona).toBe('CEO');
    expect(context.activeDomain).toBe('FINANCE');
    expect(context.relevantAgentIds.length).toBeGreaterThan(0);
  });
});
