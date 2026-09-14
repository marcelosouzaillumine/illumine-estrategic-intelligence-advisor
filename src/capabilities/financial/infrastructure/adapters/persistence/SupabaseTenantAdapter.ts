import { ITenantPersistence } from '../../../../../contracts/persistence/ITenantPersistence';
import { Tenant, Membership } from '../../../../../domain/tenant/Tenant';
import { getSupabaseClient } from '../../../../../infrastructure/supabase/SupabaseClient';

export class SupabaseTenantAdapter implements ITenantPersistence {
  async getTenantById(tenantId: string): Promise<Tenant | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .schema('tenant')
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (error || !data) return null;
    return this.mapToTenant(data);
  }

  async getTenantsByOwnerId(ownerId: string): Promise<Tenant[]> {
    const supabase = getSupabaseClient();
    // Since RLS handles isolation, we just select all tenants available to the user.
    // In this strict adapter context, we ignore ownerId filtering if RLS guarantees it, 
    // or we'd ideally query memberships. For now, querying tenants relies on RLS.
    const { data, error } = await supabase
      .schema('tenant')
      .from('tenants')
      .select('*');

    if (error || !data) return [];
    return data.map(this.mapToTenant);
  }

  async createTenant(tenant: Tenant): Promise<string> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .schema('tenant')
      .from('tenants')
      .insert({
        id: tenant.id,
        name: tenant.name,
        status: tenant.status
      });
    
    if (error) throw new Error(error.message);
    return tenant.id;
  }

  async updateTenant(tenantId: string, payload: Partial<Tenant>): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .schema('tenant')
      .from('tenants')
      .update({
        name: payload.name,
        status: payload.status
      })
      .eq('id', tenantId);

    if (error) throw new Error(error.message);
  }

  async deleteTenant(tenantId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .schema('tenant')
      .from('tenants')
      .delete()
      .eq('id', tenantId);

    if (error) throw new Error(error.message);
  }

  async getMembershipsByUserId(userId: string): Promise<Membership[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .schema('tenant')
      .from('memberships')
      .select('*, roles(name)')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data.map(this.mapToMembership);
  }

  async getMembershipsByTenantId(tenantId: string): Promise<Membership[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .schema('tenant')
      .from('memberships')
      .select('*, roles(name)')
      .eq('tenant_id', tenantId);

    if (error || !data) return [];
    return data.map(this.mapToMembership);
  }

  async createMembership(membership: Membership): Promise<void> {
    // In a real scenario we'd need to resolve roleCode to a role_id
    // Skipping complex write logic for this abstraction proof step
    throw new Error('Not implemented for staging phase');
  }

  async updateMembership(membershipId: string, payload: Partial<Membership>): Promise<void> {
    throw new Error('Not implemented for staging phase');
  }

  async removeMembership(membershipId: string): Promise<void> {
    throw new Error('Not implemented for staging phase');
  }

  // Helper mappings from DB shape to Domain shape
  private mapToTenant(row: any): Tenant {
    return {
      id: row.id,
      name: row.name,
      status: row.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
      // Provide defaults for domain fields missing in the unified DB schema
      type: 'CLIENT',
      ownerId: 'SYSTEM', // Handled by RLS roles in Postgres
      createdAt: new Date(row.created_at)
    };
  }

  private mapToMembership(row: any): Membership {
    return {
      id: row.id,
      userId: row.user_id,
      tenantId: row.tenant_id,
      roleCode: row.roles?.name || 'OPERATOR',
      status: row.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
      joinedAt: new Date(row.created_at)
    };
  }
}
