import { Workspace } from './TenancyTypes';
import { TenantRegistry } from './TenantRegistry';

export class AdvisorWorkspaceManager {
  static async listAvailableWorkspaces(tenantId: string): Promise<Workspace[]> {
    return await TenantRegistry.listWorkspacesForTenant(tenantId);
  }
}
