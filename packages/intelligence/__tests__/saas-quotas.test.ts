/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { QuotaEnforcementEngine } from '../saas-foundation/src';

describe('@illumine/governance (Wave 19.1 SaaS Quota Enforcement Engine)', () => {
  it('should enforce organization quotas and limits', () => {
    const quota = QuotaEnforcementEngine.initDefaultQuota('org-alpha');
    expect(QuotaEnforcementEngine.canAddCompany(quota)).toBe(true);
  });
});
