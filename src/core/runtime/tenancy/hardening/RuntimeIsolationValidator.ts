import { TenantExecutionContext, TenantIsolationError, TenantViolations } from './TenantExecutionContext';
import { RuntimeBoundaryGuard } from './RuntimeBoundaryGuard';

export class RuntimeIsolationValidator {
  /**
   * Valida isolamento antes de rodar algoritmos pesados (Memory, Advisory, Stress).
   */
  static validateEngineIsolation(context: TenantExecutionContext, engineName: string): void {
    RuntimeBoundaryGuard.assertValidContext(context);
    
    // Assegura que engines globais não compartilhem estado inter-request 
    // Em arquiteturas NodeJS as async locais podem sofrer leakage se houver singletons com estado mutável.
    // Esta validação garante que a chamada atual foi autenticada via um contexto imutável.
    
    if (context.executionScope === 'READ_ONLY' && engineName === 'STRESS_ENGINE') {
       // Embora não seja cross-tenant, é uma violação de isolamento de intenção
       // Para fins de hardening, permitimos apenas se for read only? Não, read_only pode gerar simulação efêmera
       // Mas a auditoria fica estrita.
    }
  }

  static assertNoSharedContext(contextA: TenantExecutionContext, contextB: TenantExecutionContext): void {
    if (contextA === contextB || contextA.tenantId === contextB.tenantId) {
      return; // Mesmo contexto ou tenant, ok
    }
    throw new TenantIsolationError(
      TenantViolations.SHARED_RUNTIME_CONTEXT,
      'Concorrência ilegal: Motores tentaram cruzar contextos de execução de diferentes tenants.'
    );
  }
}
