import { ITenantPersistence } from '../contracts/persistence/ITenantPersistence';
import { Tenant, Membership } from '../domain/tenant/Tenant';

export class TenantRepository {
  constructor(private persistence: ITenantPersistence) {}

  async getTenantById(tenantId: string): Promise<Tenant | null> {
    return this.persistence.getTenantById(tenantId);
  }

  async getTenantsByOwnerId(ownerId: string): Promise<Tenant[]> {
    return this.persistence.getTenantsByOwnerId(ownerId);
  }

  async createTenant(tenant: Tenant): Promise<string> {
    return this.persistence.createTenant(tenant);
  }

  async updateTenant(tenantId: string, payload: Partial<Tenant>): Promise<void> {
    return this.persistence.updateTenant(tenantId, payload);
  }

  async deleteTenant(tenantId: string): Promise<void> {
    return this.persistence.deleteTenant(tenantId);
  }

  async getMembershipsByUserId(userId: string): Promise<Membership[]> {
    return this.persistence.getMembershipsByUserId(userId);
  }

  async getMembershipsByTenantId(tenantId: string): Promise<Membership[]> {
    return this.persistence.getMembershipsByTenantId(tenantId);
  }

  async createMembership(membership: Membership): Promise<void> {
    return this.persistence.createMembership(membership);
  }

  async updateMembership(membershipId: string, payload: Partial<Membership>): Promise<void> {
    return this.persistence.updateMembership(membershipId, payload);
  }

  async removeMembership(membershipId: string): Promise<void> {
    return this.persistence.removeMembership(membershipId);
  }
}
