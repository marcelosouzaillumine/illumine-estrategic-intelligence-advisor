import { ConsolidationEntity } from '../../../capabilities/financial/runtime/consolidated/types';
import { EntityGraphData } from '../../../topology/types';
import { TenantExecutionContext, TenantIsolationError, TenantViolations } from './TenantExecutionContext';
import { RuntimeBoundaryGuard } from './RuntimeBoundaryGuard';

export class TenantOwnershipValidator {
  /**
   * Checa se todas as entidades pertencem explicitamente ao tenantId do contexto.
   */
  static validateEntitiesOwnership(context: TenantExecutionContext, entities: ConsolidationEntity[]): void {
    RuntimeBoundaryGuard.assertValidContext(context);
    
    for (const entity of entities) {
      const id = entity.id || (entity as unknown as { entityId?: string }).entityId;
      if (!entity.tenantId) {
        throw new TenantIsolationError(
          TenantViolations.INVALID_TOPOLOGY_SCOPE,
          `Entidade órfã detectada (${id}): Sem tenantId. Execução abortada (Fail-Closed).`
        );
      }

      if (entity.tenantId !== context.tenantId) {
        throw new TenantIsolationError(
          TenantViolations.CROSS_TENANT_ACCESS,
          `Violação de Fronteira: Entidade ${id} pertence ao Tenant ${entity.tenantId}, mas a execução atual é do Tenant ${context.tenantId}.`
        );
      }

      // Além do tenantId, deve pertencer ao escopo explícito daquela request
      RuntimeBoundaryGuard.assertEntityInScope(context, id);
    }
  }

  /**
   * Bloqueia entity cruzada ou topology inconsistente.
   */
  static validateTopologyScope(context: TenantExecutionContext, topology: EntityGraphData): void {
    RuntimeBoundaryGuard.assertValidContext(context);

    // Na topologia, cada node DEVE pertencer ao escopo ou ser do locatário
    topology.nodes.forEach(node => {
      // Se houvesse node.tenantId na EntityGraphNode, validaríamos aqui.
      // Assumiremos que a validação primária de ownership ocorre nas entidades.
      // Valida se o node está no escopo de execução
      RuntimeBoundaryGuard.assertEntityInScope(context, node.id);
    });

    topology.edges.forEach(edge => {
      RuntimeBoundaryGuard.assertEntityInScope(context, edge.sourceId);
      RuntimeBoundaryGuard.assertEntityInScope(context, edge.targetId);
    });
  }
}
