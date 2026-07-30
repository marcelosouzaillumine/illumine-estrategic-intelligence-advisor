/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { TenantProvisioningService } from '../saas-foundation/src';

describe('@illumine/intelligence (Wave 19.1 SaaS Tenant Provisioning)', () => {
  it('should provision active isolated database tenant for organization', () => {
    const tenant = TenantProvisioningService.provisionTenant('org-alpha', 'alpha.illumine.ai');
    expect(tenant.tenantDomain).toBe('alpha.illumine.ai');
    expect(tenant.isIsolatedDatabase).toBe(true);
    expect(tenant.status).toBe('ACTIVE');
  });
});
