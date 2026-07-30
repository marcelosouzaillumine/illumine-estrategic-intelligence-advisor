/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { MultiAdvisorAssignmentEngine } from '../partner-ecosystem/src';

describe('@illumine/intelligence (Wave 18.11 Multi-Advisor Assignment Engine)', () => {
  it('should assign multiple specialized advisors to a company with independent scopes', () => {
    const asgnFin = MultiAdvisorAssignmentEngine.assignAdvisor('company-granatum', 'adv-fin-01', 'FINANCIAL');
    const asgnOp = MultiAdvisorAssignmentEngine.assignAdvisor('company-granatum', 'adv-op-01', 'OPERATIONAL');

    expect(asgnFin.roleType).toBe('FINANCIAL');
    expect(asgnOp.roleType).toBe('OPERATIONAL');
    expect(asgnFin.companyId).toBe('company-granatum');
  });
});
