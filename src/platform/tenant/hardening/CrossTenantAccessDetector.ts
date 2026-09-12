import { TenantExecutionContext, TenantIsolationError, TenantViolations } from './TenantExecutionContext';
import { RuntimeBoundaryGuard } from './RuntimeBoundaryGuard';

export class CrossTenantAccessDetector {
  /**
   * Detector dinâmico para rodar durante operações críticas que puxam dados cacheados
   * ou cruzam grafos (ex: Stress Propagation, Intercompany Eliminations).
   */
  static detectMemoryViolation(context: TenantExecutionContext, accessedEntityId: string, cachedTenantId: string): void {
    RuntimeBoundaryGuard.assertValidContext(context);
    
    // Se a entidade que estamos tentando acessar foi cacheada sob um locatário diferente
    if (cachedTenantId && cachedTenantId !== context.tenantId) {
      throw new TenantIsolationError(
        TenantViolations.TENANT_BOUNDARY_VIOLATION,
        `Vazamento Inter-Tenant bloqueado: O contexto atual (${context.tenantId}) tentou acessar a entidade na memória associada ao locatário estrangeiro (${cachedTenantId}).`
      );
    }
  }

  /**
   * Na propagação causal, verifica se um target está no mesmo tenant do source.
   */
  static assertCausalEdgeCompliance(context: TenantExecutionContext, sourceEntityId: string, targetEntityId: string): void {
    RuntimeBoundaryGuard.assertEntityInScope(context, sourceEntityId);
    RuntimeBoundaryGuard.assertEntityInScope(context, targetEntityId);
  }
}
