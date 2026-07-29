export interface LogEvent {
  eventId: string;
  tenantId: string;
  service: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  timestamp: string;
  correlationId: string;
  metadata?: Record<string, any>;
}

export class EnterpriseLogger {
  public static log(event: LogEvent): void {
    console.log(`[${event.severity}] [${event.service}] [Tenant: ${event.tenantId}] [Correlation: ${event.correlationId}] ${event.eventId}`);
  }
}
