import { logger } from "../../services/logging/InstitutionalLogger";
export interface AuditTrace {
  traceId: string;
  timestamp: string;
  tenantId: string;
  actorId: string;
  role: string;
  action: string;
  resourceType: string;
  permissionGranted: boolean;
  denialCode?: string;
  lineageHash?: string;
}

export class GovernanceAuditTrace {
  private static traces: AuditTrace[] = [];

  public static traceAction(trace: Omit<AuditTrace, 'traceId' | 'timestamp'>): AuditTrace {
    const fullTrace: AuditTrace = {
      ...trace,
      traceId: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.traces.push(fullTrace);

    if (this.traces.length > 500) {
      this.traces.shift();
    }

    if (!trace.permissionGranted) {
      logger.warn('SECURITY WARNING/DENIAL AUDIT', { actorId: trace.actorId, role: trace.role, action: trace.action, denialCode: trace.denialCode });
    } else {
      console.log(`[GovernanceAuditTrace] ACTION AUDIT: Actor ${trace.actorId} performed ${trace.action} successfully.`);
    }

    return fullTrace;
  }

  public static getDenialsForTenant(tenantId: string): AuditTrace[] {
    return this.traces.filter(t => t.tenantId === tenantId && !t.permissionGranted);
  }

  public static getTracesForTenant(tenantId: string): AuditTrace[] {
    return this.traces.filter(t => t.tenantId === tenantId);
  }
}
