import { DeferredExecutionResult } from './types';
import { TenantIsolationError, TenantViolations } from '../tenancy/hardening/TenantExecutionContext';
import { getErrorMessage } from '../../../types/runtime/RuntimeErrorGuards';

export class LazyExecutionCoordinator {
  /**
   * Encapsula a execução de um bloco pesado do Runtime, decidindo
   * se ele deve rodar agora, ou se será adiado (DEFERRED).
   */
  static executeSafely<T>(
    blockName: string,
    isDeferredAllowed: boolean,
    hasRequiredData: boolean,
    executionBlock: () => T
  ): DeferredExecutionResult<T> {
    
    if (!hasRequiredData) {
      return {
        status: 'BLOCKED',
        reason: `Dados insuficientes para executar ${blockName}.`,
        violations: [],
      };
    }

    if (isDeferredAllowed) {
      return {
        status: 'DEFERRED',
        reason: `${blockName} foi movido para execução sob demanda (Lazy Loading).`,
        expectedTrigger: `USER_INTERACTION_${blockName.toUpperCase()}`,
        confidenceImpact: 0,
        violations: []
      };
    }

    // Caso não seja deferido, executa a engine
    try {
      const result = executionBlock();
      // Não podemos mascarar um resultado que foi computado mas não retornou validamente
      if (result === undefined || result === null) {
         throw new TenantIsolationError(
           TenantViolations.LAZY_EXECUTION_HIDDEN_RESULT,
           `A execução do bloco ${blockName} retornou um valor nulo/silencioso que mascara a causalidade.`
         );
      }
      return {
        status: 'EXECUTED',
        data: result
      };
    } catch (error: unknown) {
      if (error instanceof TenantIsolationError) {
        throw error;
      }
      return {
        status: 'BLOCKED',
        reason: `Falha interna ao executar ${blockName}: ${getErrorMessage(error)}`,
        violations: ['RUNTIME_EXECUTION_FAILURE']
      };
    }
  }
}
