import { TenantExecutionContext } from './TenantExecutionContext';

export class LegacyTenantContextAdapter {
  /**
   * Atribui um tenantId explícito para ambientes single-entity legados.
   * Nunca implícito ou silencioso, deve ser explicitamente chamado.
   */
  static createLegacyContext(
    allowedEntityId: string, 
    actorId: string = 'LEGACY_SYSTEM_ADAPTER'
  ): TenantExecutionContext {
    return {
      tenantId: 'LEGACY_SINGLE_TENANT_ID',
      executionScope: 'CONSOLIDATION', // or 'READ_ONLY' depending on use
      entityScope: [allowedEntityId],
      runtimeScope: 'SINGLE_ENTITY',
      auditScope: actorId
    };
  }

  static isLegacyContext(context: TenantExecutionContext): boolean {
    return context.tenantId === 'LEGACY_SINGLE_TENANT_ID';
  }
}
