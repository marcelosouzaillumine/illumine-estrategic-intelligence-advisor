import { AIQueryRequest, AIAllowedContext } from './AIGovernanceTypes';
import { AIPermissionResolver } from './AIPermissionResolver';
import { AITenantBoundaryEnforcer } from './AITenantBoundaryEnforcer';
import { TenantRole } from '../tenancy/TenancyTypes';

export class AIContextResolver {
  /**
   * Busca e filtra contexto institucional rigorosamente baseado em permissões e boundary isolation.
   */
  static async resolveContext(request: AIQueryRequest): Promise<AIAllowedContext[]> {
    const rawContexts: AIAllowedContext[] = [
      // Mock Data fetched from Data Layer / Firebase based on requestedContexts
      {
        contextId: 'REP-2024.1',
        payload: { type: 'REPORT', tenantId: request.tenantId, workspaceId: request.workspaceId, data: 'Mock Report Data' },
        lineageHash: 'HASH-123'
      }
    ];

    // Filter by Role
    const roleFiltered = rawContexts.filter(ctx => 
      AIPermissionResolver.canAccessContext(request.role as TenantRole, ctx.payload.type)
    );

    // Filter by Tenant Isolation
    const isolationFiltered = AITenantBoundaryEnforcer.enforceBoundaries(request, roleFiltered);

    return isolationFiltered;
  }
}
