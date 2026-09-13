import { RuntimeTelemetryData } from './types';
import { TenantViolations, TenantIsolationError } from '../../../core/runtime/tenancy/hardening/TenantExecutionContext';

export class RuntimePerformanceMonitor {
  private static MAX_EXECUTION_DEPTH = 50;
  private static MAX_MEMORY_USAGE = 512 * 1024 * 1024; // 512 MB per tenant execution slice (arbitrary limit for local safety)
  private static MAX_EXECUTION_TIME_MS = 30000;

  static checkExecutionDepth(depth: number, tenantId: string) {
    if (depth > this.MAX_EXECUTION_DEPTH) {
      throw new TenantIsolationError(
        TenantViolations.EXECUTION_DEPTH_OVERFLOW,
        `Limite de profundidade de orquestração excedido (${depth}) para o Tenant ${tenantId}. Risco de Recursive Runtime Loop.`
      );
    }
  }

  static analyzeTelemetry(telemetry: RuntimeTelemetryData) {
    const warnings: string[] = [];

    if (telemetry.metrics.memoryUsageBytes > this.MAX_MEMORY_USAGE) {
      warnings.push(`[RUNTIME_SATURATION] Uso de memória muito elevado: ${(telemetry.metrics.memoryUsageBytes / 1024 / 1024).toFixed(2)} MB`);
    }

    if (telemetry.metrics.executionTimeMs > this.MAX_EXECUTION_TIME_MS) {
      warnings.push(`[EXECUTION_BOTTLENECK] O tempo de execução da orquestração (${telemetry.metrics.executionTimeMs} ms) excedeu o limite seguro.`);
    }

    if (telemetry.metrics.orchestrationDepth > this.MAX_EXECUTION_DEPTH) {
      warnings.push(`[RECURSIVE_RUNTIME_LOOP_WARNING] A orquestração atingiu uma profundidade crítica (${telemetry.metrics.orchestrationDepth}). Possível loop na topologia.`);
    }

    if (telemetry.metrics.tenantExecutionLoadPercent > 90) {
      warnings.push(`[TOPOLOGY_OVERLOAD] O tenant está saturando a Engine consolidada.`);
    }

    return warnings;
  }
}
