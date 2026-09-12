export interface QuotaAuditEvent {
  timestamp: string;
  tenantId: string;
  eventType: 'CONSUMPTION' | 'THROTTLING' | 'SATURATION' | 'QUOTA_VIOLATION' | 'EXECUTION_DENIAL' | 'ESCALATION_ATTEMPT';
  details: string;
  metrics: {
    budgetUsedMs: number;
    budgetLimitMs: number;
    topologyDepth: number;
    topologyLimit: number;
    advisoryCount: number;
    advisoryLimit: number;
  };
  signature: string;
}

export class RuntimeQuotaAuditTrail {
  private static eventLog: QuotaAuditEvent[] = [];

  public static logEvent(
    tenantId: string,
    eventType: QuotaAuditEvent['eventType'],
    details: string,
    budgetUsedMs: number,
    budgetLimitMs: number,
    topologyDepth: number,
    topologyLimit: number,
    advisoryCount: number,
    advisoryLimit: number
  ): QuotaAuditEvent {
    const timestamp = new Date().toISOString();
    
    // Criptographic-like integrity signature to prevent tampering
    const signaturePayload = `${timestamp}|${tenantId}|${eventType}|${budgetUsedMs}/${budgetLimitMs}|${topologyDepth}/${topologyLimit}`;
    let hash = 0;
    for (let i = 0; i < signaturePayload.length; i++) {
      hash = (hash << 5) - hash + signaturePayload.charCodeAt(i);
      hash |= 0;
    }
    const signature = `SIG-QUOTA-${Math.abs(hash)}`;

    const event: QuotaAuditEvent = {
      timestamp,
      tenantId,
      eventType,
      details,
      metrics: {
        budgetUsedMs,
        budgetLimitMs,
        topologyDepth,
        topologyLimit,
        advisoryCount,
        advisoryLimit
      },
      signature
    };

    this.eventLog.push(event);
    return event;
  }

  public static getEvents(tenantId?: string): QuotaAuditEvent[] {
    if (tenantId) {
      return this.eventLog.filter(e => e.tenantId === tenantId);
    }
    return [...this.eventLog];
  }

  public static clear(): void {
    this.eventLog = [];
  }
}
