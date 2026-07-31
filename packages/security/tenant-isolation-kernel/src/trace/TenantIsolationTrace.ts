export interface TenantIsolationTraceRecord {
  traceId: string;
  tenantId: string;
  resourceAccessed: string;
  decision: 'ALLOW' | 'DENY';
  timestamp: Date;
  component: string;
  reason?: string;
}

export class TenantIsolationTrace {
  static logDecision(record: TenantIsolationTraceRecord): void {
    // Em produção, isso seria persistido no Immutable Audit Log (IAL)
    console.log(`[TENANT_ISOLATION_TRACE] [${record.decision}] ${record.component}: ${record.tenantId} -> ${record.resourceAccessed}`, record.reason ? `(${record.reason})` : '');
  }
}
