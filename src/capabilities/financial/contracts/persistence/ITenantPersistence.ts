import { Tenant, Membership } from '../../../../domain/tenant/Tenant';

export interface ITenantPersistence {
  getTenantById(tenantId: string): Promise<Tenant | null>;
  getTenantsByOwnerId(ownerId: string): Promise<Tenant[]>;
  createTenant(tenant: Tenant): Promise<string>;
  updateTenant(tenantId: string, payload: Partial<Tenant>): Promise<void>;
  deleteTenant(tenantId: string): Promise<void>;

  getMembershipsByUserId(userId: string): Promise<Membership[]>;
  getMembershipsByTenantId(tenantId: string): Promise<Membership[]>;
  createMembership(membership: Membership): Promise<void>;
  updateMembership(membershipId: string, payload: Partial<Membership>): Promise<void>;
  removeMembership(membershipId: string): Promise<void>;
}
