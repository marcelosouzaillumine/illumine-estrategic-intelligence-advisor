import { RuntimeHealthState, RuntimeHealthStatus } from './types';

export class RuntimeHealthMonitoringEngine {
  /**
   * Monitora e valida a saúde do Runtime de governança.
   * Aciona FAIL_CLOSED se faltarem lineageHash, correlationId, tenantId ou se a continuidade de telemetria for quebrada.
   */
  public static evaluateHealth(params: {
    tenantId?: string;
    correlationId?: string;
    lineageHash?: string;
    telemetryContinuous: boolean;
    failedLineagesCount: number;
    hasBrokenPropagation: boolean;
  }): RuntimeHealthState {
    const lastTraceTime = new Date().toISOString();

    // 1. Postura Fail-Closed: Falta de parâmetros vitais
    if (
      !params.tenantId ||
      params.tenantId.trim() === '' ||
      !params.correlationId ||
      params.correlationId.trim() === '' ||
      !params.lineageHash ||
      params.lineageHash.trim() === '' ||
      !params.telemetryContinuous
    ) {
      return {
        status: 'FAIL_CLOSED',
        integrityPercentage: 0,
        failedLineageCount: params.failedLineagesCount || 1,
        lastTraceTime,
        hasBrokenPropagation: params.hasBrokenPropagation,
        telemetryContinuous: false
      };
    }

    // 2. Classificação de Degradação Parcial
    let status: RuntimeHealthStatus = 'HEALTHY';
    let integrityPercentage = 100;

    if (params.failedLineagesCount > 0 || params.hasBrokenPropagation) {
      status = 'DEGRADED';
      integrityPercentage = 75;
    }

    if (params.failedLineagesCount > 5) {
      status = 'PARTIAL';
      integrityPercentage = 45;
    }

    return {
      status,
      integrityPercentage,
      failedLineageCount: params.failedLineagesCount,
      lastTraceTime,
      hasBrokenPropagation: params.hasBrokenPropagation,
      telemetryContinuous: params.telemetryContinuous
    };
  }
}
