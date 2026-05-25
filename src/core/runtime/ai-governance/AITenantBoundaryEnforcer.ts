import { AIQueryRequest, AIAllowedContext } from './AIGovernanceTypes';

export class AITenantBoundaryEnforcer {
  /**
   * Bloqueia qualquer contexto que não pertença ao Tenant/Workspace ativo.
   */
  static enforceBoundaries(request: AIQueryRequest, candidateContexts: AIAllowedContext[]): AIAllowedContext[] {
    return candidateContexts.filter(ctx => {
      // Mock validation. In reality, payload should have tenantId/workspaceId baked in Lineage.
      const payloadTenant = ctx.payload.tenantId;
      const payloadWorkspace = ctx.payload.workspaceId;

      if (payloadTenant && payloadTenant !== request.tenantId) {
        console.error(`[AITenantBoundaryEnforcer] Cross-Tenant Context Detectado e Removido! Context: ${ctx.contextId}`);
        return false;
      }
      if (payloadWorkspace && payloadWorkspace !== request.workspaceId) {
        console.error(`[AITenantBoundaryEnforcer] Cross-Workspace Context Detectado e Removido! Context: ${ctx.contextId}`);
        return false;
      }
      return true;
    });
  }
}
