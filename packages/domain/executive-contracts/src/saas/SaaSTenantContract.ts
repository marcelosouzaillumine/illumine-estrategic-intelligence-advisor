export interface SaaSTenantContract {
  readonly tenantId: string;
  readonly organizationId: string;
  readonly tenantDomain: string;
  readonly isIsolatedDatabase: boolean;
  readonly status: 'PROVISIONING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  readonly createdAt: string;
}
