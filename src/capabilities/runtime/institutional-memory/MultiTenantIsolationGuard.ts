import { HistoricalCycleData } from './types';

export class MultiTenantIsolationGuard {
  /**
   * Valida rigorosamente o isolamento de tenant para qualquer payload histórico.
   * Em caso de violação, emite uma exceção irreversível para bloquear a execução (Fail-Closed).
   */
  public static validate(targetTenantId: string, cycles: HistoricalCycleData[]): void {
    if (!targetTenantId) {
      throw new Error('CROSS_TENANT_LONGITUDINAL_ATTEMPT: targetTenantId is mandatory for memory evaluation.');
    }

    for (const cycle of cycles) {
      // Se a propriedade existir e for divergente, é uma violação clara
      if (cycle.tenantId && cycle.tenantId !== targetTenantId) {
        
        // 1. Immutable Audit Trail (Simulado via console para logs da infraestrutura)
        console.error(JSON.stringify({
          eventType: 'CROSS_TENANT_LONGITUDINAL_ATTEMPT',
          severity: 'CRITICAL',
          timestamp: new Date().toISOString(),
          details: {
            expectedTenant: targetTenantId,
            foundTenant: cycle.tenantId,
            violationYear: cycle.year,
            correlationId: cycle.correlationId
          }
        }));

        // 2. Fail-Closed Exceção
        throw new Error(`CROSS_TENANT_LONGITUDINAL_ATTEMPT: Unauthorized historical access for tenant ${cycle.tenantId}. Execution blocked.`);
      }
    }
  }
}
