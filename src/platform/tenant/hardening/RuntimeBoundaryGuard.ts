import { TenantExecutionContext, TenantIsolationError, TenantViolations } from './TenantExecutionContext';

export class RuntimeBoundaryGuard {
  /**
   * Fail-Closed guard.
   * Não permite executar runtime sem tenantId, não gera advisory, não acessa cache.
   */
  static assertValidContext(context?: TenantExecutionContext): void {
    if (!context) {
      throw new TenantIsolationError(
        TenantViolations.MISSING_TENANT_CONTEXT,
        'Execução bloqueada: Contexto de Tenant obrigatório ausente. Fail-Closed acionado.'
      );
    }

    if (!context.tenantId || context.tenantId.trim() === '') {
      throw new TenantIsolationError(
        TenantViolations.MISSING_TENANT_CONTEXT,
        'Execução bloqueada: tenantId inválido ou vazio. Fail-Closed acionado.'
      );
    }

    if (!context.entityScope || !Array.isArray(context.entityScope)) {
      throw new TenantIsolationError(
        TenantViolations.INVALID_ENTITY_SCOPE,
        'Execução bloqueada: entityScope ausente ou malformado.'
      );
    }
  }

  static assertEntityInScope(context: TenantExecutionContext, entityId: string): void {
    this.assertValidContext(context);
    if (!context.entityScope.includes(entityId)) {
      throw new TenantIsolationError(
        TenantViolations.INVALID_ENTITY_SCOPE,
        `Entidade ${entityId} fora do escopo permitido para o locatário ${context.tenantId}.`
      );
    }
  }
}
