import { TenantExecutionContext } from './TenantExecutionContext';
import { RuntimeBoundaryGuard } from './RuntimeBoundaryGuard';
import { TenantOwnershipValidator } from './TenantOwnershipValidator';
import { CrossTenantAccessDetector } from './CrossTenantAccessDetector';
import { TenantAwareAuditTrail } from './TenantAwareAuditTrail';
import { RuntimeIsolationValidator } from './RuntimeIsolationValidator';
import { ConsolidationEntity } from '../../../capabilities/financial/runtime/consolidated/types';
import { EntityGraphData } from '../../../topology/types';
import { getErrorMessage, isViolationLike } from '../../../types/runtime/RuntimeErrorGuards';

export class TenantGovernanceEnforcer {
  /**
   * Ponto de entrada unificado para blindagem de Tenant.
   * Deve ser chamado na inicialização de qualquer orquestrador consolidado.
   */
  static enforceConsolidationBoundaries(
    context: TenantExecutionContext | undefined, 
    entities: ConsolidationEntity[], 
    topology: EntityGraphData
  ): void {
    try {
      // 1. Guarda primária - fail-closed se contexto ausente
      RuntimeBoundaryGuard.assertValidContext(context);
      const safeContext = context!;

      // 2. Isolamento de runtime
      RuntimeIsolationValidator.validateEngineIsolation(safeContext, 'CONSOLIDATED_ORCHESTRATOR');

      // 3. Ownership das Entidades e Topologia
      TenantOwnershipValidator.validateEntitiesOwnership(safeContext, entities);
      TenantOwnershipValidator.validateTopologyScope(safeContext, topology);

      // 4. Sucesso: Registrar log de auditoria isolado
      TenantAwareAuditTrail.logExecutionAttempt(safeContext, `exec-${Date.now()}`, 'CONSOLIDATED_RUNTIME_START');
      
    } catch (error: unknown) {
      // Falhou a validação: logar forense e re-lançar a exceção fatal
      TenantAwareAuditTrail.logViolation(context || null, (isViolationLike(error) ? error.violationCode : 'UNKNOWN_VIOLATION') || 'UNKNOWN_VIOLATION', getErrorMessage(error));
      throw error;
    }
  }

  static enforceCacheAccess(context: TenantExecutionContext, accessedEntityId: string, cachedTenantId: string): void {
    try {
      CrossTenantAccessDetector.detectMemoryViolation(context, accessedEntityId, cachedTenantId);
    } catch (error: unknown) {
      TenantAwareAuditTrail.logViolation(context, (isViolationLike(error) ? error.violationCode : 'UNKNOWN_VIOLATION') || 'CACHE_VIOLATION', getErrorMessage(error));
      throw error;
    }
  }
}
