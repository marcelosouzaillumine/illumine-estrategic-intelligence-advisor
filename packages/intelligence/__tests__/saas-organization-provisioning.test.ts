/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { OrganizationProvisioningService } from '../saas-foundation/src';

describe('@illumine/intelligence (Wave 19.1 SaaS Organization Provisioning)', () => {
  it('should provision organization automatically with default tenant reference (SFP v1.0)', () => {
    const org = OrganizationProvisioningService.provisionOrganization('Grupo Alpha Capital', 'user-01');
    expect(org.name).toBe('Grupo Alpha Capital');
    expect(org.ownerUserId).toBe('user-01');
    expect(org.subscriptionPlan).toBe('ENTERPRISE_PARTNER');
  });
});
