import { RuntimeTelemetryData } from '../../../core/runtime/performance/types';

export class TelemetryAuditTrail {
  private static telemetryLogs: RuntimeTelemetryData[] = [];

  static logTelemetry(data: RuntimeTelemetryData): void {
    // Immutable snapshot of telemetry
    this.telemetryLogs.push(Object.freeze({ ...data }));
  }

  static getTelemetryForTenant(tenantId: string): RuntimeTelemetryData[] {
    return this.telemetryLogs.filter(log => log.tenantId === tenantId);
  }

  static clear(tenantId: string): void {
    this.telemetryLogs = this.telemetryLogs.filter(log => log.tenantId !== tenantId);
  }
}
