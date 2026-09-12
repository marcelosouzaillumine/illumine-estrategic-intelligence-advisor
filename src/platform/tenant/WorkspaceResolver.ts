import { TenantRegistry } from './TenantRegistry';
import { AdvisorWorkspaceContext } from './TenancyTypes';

export class WorkspaceResolver {
  /**
   * Resolve o Workspace base para um usuário logado.
   * Se o usuário recém logou e não escolheu, retorna o Workspace Padrão.
   */
  static async resolveDefaultContext(userId: string): Promise<AdvisorWorkspaceContext | null> {
    // MOCK: Em prod, busca no banco qual Tenant o user pertence.
    const tenantId = 'TENANT-ILLUMINE-HQ';
    const tenant = await TenantRegistry.getTenant(tenantId);
    
    if (!tenant) {
      // Fallback para desenvolvimento (substitui mock removido)
      return {
        activeTenantId: 'TENANT-ILLUMINE-HQ',
        activeWorkspaceId: 'WS-ILLUMINE-ALPHA',
        activeGroupId: 'GRP-ALPHA-01',
        role: 'MASTER_ADMIN'
      };
    }

    const workspaces = await TenantRegistry.listWorkspacesForTenant(tenantId);
    if (workspaces.length === 0) {
      return {
        activeTenantId: tenant.tenantId,
        activeWorkspaceId: 'WS-ILLUMINE-ALPHA',
        activeGroupId: 'GRP-ALPHA-01',
        role: 'MASTER_ADMIN'
      };
    }

    const defaultWorkspace = workspaces[0];

    return {
      activeTenantId: tenant.tenantId,
      activeWorkspaceId: defaultWorkspace.workspaceId,
      activeGroupId: defaultWorkspace.groupId,
      role: 'MASTER_ADMIN' // MVP Mock
    };
  }
}
