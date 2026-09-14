import { identityContainer } from '../../../../infrastructure/container/identityContainer';
import { Tenant, Membership } from '../../../../domain/tenant/Tenant';

export class TenantService {
  static async getActiveTenantsForUser(userId: string): Promise<{ tenant: Tenant; membership: Membership }[]> {
    const memberships = await identityContainer.tenant.getMembershipsByUserId(userId);
    const activeMemberships = memberships.filter(m => m.status === 'ACTIVE');
    
    const results: { tenant: Tenant; membership: Membership }[] = [];
    for (const m of activeMemberships) {
      const tenant = await identityContainer.tenant.getTenantById(m.tenantId);
      if (tenant && tenant.status === 'ACTIVE') {
        results.push({ tenant, membership: m });
      }
    }
    
    return results;
  }

  static async getMembershipsByTenant(tenantId: string): Promise<Membership[]> {
    return identityContainer.tenant.getMembershipsByTenantId(tenantId);
  }

  static async createMembership(membership: Membership): Promise<void> {
    return identityContainer.tenant.createMembership(membership);
  }

  static async removeMembership(membershipId: string): Promise<void> {
    return identityContainer.tenant.removeMembership(membershipId);
  }
}
