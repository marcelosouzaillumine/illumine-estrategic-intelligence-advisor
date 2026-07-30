import { SaaSTenantContract } from '@illumine/executive-contracts';

export class TenantProvisioningService {
  public static provisionTenant(organizationId: string, domain: string): SaaSTenantContract {
    return {
      tenantId: `tenant-${organizationId}`,
      organizationId,
      tenantDomain: domain,
      isIsolatedDatabase: true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
  }
}
