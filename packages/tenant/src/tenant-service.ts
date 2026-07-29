import { Tenant, Organization, Workspace } from './tenant-context';

export class TenantService {
  private tenants = new Map<string, Tenant>();
  private organizations = new Map<string, Organization>();
  private workspaces = new Map<string, Workspace>();

  public createTenant(name: string): Tenant {
    const tenant: Tenant = {
      id: `tnt-${Math.random().toString(36).substring(2, 9)}`,
      name,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  public createOrganization(tenantId: string, name: string): Organization {
    const org: Organization = {
      id: `org-${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      name
    };
    this.organizations.set(org.id, org);
    return org;
  }

  public createWorkspace(org: Organization, name: string): Workspace {
    const ws: Workspace = {
      id: `ws-${Math.random().toString(36).substring(2, 9)}`,
      organizationId: org.id,
      tenantId: org.tenantId,
      name
    };
    this.workspaces.set(ws.id, ws);
    return ws;
  }
}

export const tenantService = new TenantService();
