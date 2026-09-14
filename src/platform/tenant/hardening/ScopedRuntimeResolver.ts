import { TenantExecutionContext } from './TenantExecutionContext';
import { RuntimeBoundaryGuard } from './RuntimeBoundaryGuard';

export class ScopedRuntimeResolver {
  /**
   * Constrói chaves de cache e dependência que são inerentemente isoladas pelo tenant.
   * Evita colisão de dados na RAM ou Redis para entidades homônimas em tenants diferentes.
   */
  static generateTenantScopedCacheKey(context: TenantExecutionContext, baseKey: string): string {
    RuntimeBoundaryGuard.assertValidContext(context);
    return `tenant:${context.tenantId}:cache:${baseKey}`;
  }

  static generateTenantScopedLineageKey(context: TenantExecutionContext, lineageNodeId: string): string {
    RuntimeBoundaryGuard.assertValidContext(context);
    return `tenant:${context.tenantId}:lineage:${lineageNodeId}`;
  }
}
