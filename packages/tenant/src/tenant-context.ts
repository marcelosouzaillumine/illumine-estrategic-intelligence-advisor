import { PlatformError } from '../../core/src/errors/platform-error';

export interface Tenant {
  id: string;
  name: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface Organization {
  id: string;
  tenantId: string;
  name: string;
}

export interface Workspace {
  id: string;
  organizationId: string;
  tenantId: string;
  name: string;
}

export class TenantContext {
  private activeTenant: Tenant | null = null;
  private activeOrganization: Organization | null = null;
  private activeWorkspace: Workspace | null = null;

  public setContext(tenant: Tenant, org: Organization, ws: Workspace): void {
    if (org.tenantId !== tenant.id || ws.tenantId !== tenant.id) {
      throw new PlatformError({
        code: 'ERR_TENANT_ISOLATION_VIOLATION',
        message: 'Organização ou Workspace pertencem a um tenant diferente.',
        category: 'SECURITY',
        severity: 'MUST',
        timestamp: new Date().toISOString()
      });
    }

    this.activeTenant = tenant;
    this.activeOrganization = org;
    this.activeWorkspace = ws;
  }

  public getTenantId(): string {
    if (!this.activeTenant) {
      throw new PlatformError({
        code: 'ERR_TENANT_CONTEXT_MISSING',
        message: 'Contexto de Tenant não foi inicializado.',
        category: 'SECURITY',
        severity: 'MUST',
        timestamp: new Date().toISOString()
      });
    }
    return this.activeTenant.id;
  }

  public getActiveTenant(): Tenant | null {
    return this.activeTenant;
  }

  public clear(): void {
    this.activeTenant = null;
    this.activeOrganization = null;
    this.activeWorkspace = null;
  }
}

export const tenantContext = new TenantContext();
