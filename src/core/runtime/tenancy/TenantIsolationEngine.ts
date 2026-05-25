import { AdvisorWorkspaceContext } from './TenancyTypes';
import { TenantRegistry } from './TenantRegistry';

export class TenantIsolationEngine {
  /**
   * O Cão de Guarda da Plataforma.
   * Valida se um Grupo Econômico (GroupId) solicitado pertence de fato ao Workspace/Tenant ativo.
   */
  static async validateAccess(context: AdvisorWorkspaceContext, targetGroupId: string): Promise<boolean> {
    const workspace = await TenantRegistry.getWorkspace(context.activeWorkspaceId);
    
    if (!workspace) return false;
    
    // Regra de Ouro: O Grupo solicitado deve bater com o Grupo amarrado ao Workspace deste Tenant.
    if (workspace.tenantId !== context.activeTenantId) return false;
    if (workspace.groupId !== targetGroupId) return false;

    return true;
  }
}
