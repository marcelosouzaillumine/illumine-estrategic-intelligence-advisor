/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveContextAssembler, ExecutivePolicyEngine } from '../index';

describe('Quality Gate 2 — Policy Enforcement Test', () => {
  it('should block orchestration if context envelope is unvalidated', () => {
    const rawContext = ExecutiveContextAssembler.assembleBaseContext('empresa-pol-check', 'FINANCIAL');
    const policy = ExecutivePolicyEngine.evaluatePolicy(rawContext);

    expect(policy.isExecutionAllowed).toBe(false);
    expect(policy.complianceLevel).toBe('BLOCKED');
    expect(policy.policyReason).toContain('não validado');
  });
});
