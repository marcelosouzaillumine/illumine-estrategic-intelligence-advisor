import { TenantExecutionContext } from './TenantExecutionContext';

export interface TenantAuditLogEntry {
  tenantId: string;
  correlationId: string;
  executionId: string;
  actorScope: string;
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'VIOLATION' | 'FAIL_CLOSED';
  details: string;
}

export class TenantAwareAuditTrail {
  private static logs: TenantAuditLogEntry[] = [];
  
  static logExecutionAttempt(context: TenantExecutionContext, executionId: string, action: string): void {
    const correlationId = `corr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    this.logs.push({
      tenantId: context.tenantId,
      correlationId,
      executionId,
      actorScope: context.auditScope,
      timestamp: new Date().toISOString(),
      action,
      status: 'SUCCESS',
      details: `Iniciando execução no escopo de locatário. Scope: ${context.executionScope}`
    });
  }

  static logViolation(context: Partial<TenantExecutionContext> | null, violationCode: string, details: string): void {
    this.logs.push({
      tenantId: context?.tenantId || 'UNKNOWN_OR_MISSING_TENANT',
      correlationId: `violation-${Date.now()}`,
      executionId: 'N/A',
      actorScope: context?.auditScope || 'SYSTEM_GUARD',
      timestamp: new Date().toISOString(),
      action: 'RUNTIME_VIOLATION_DETECTED',
      status: 'FAIL_CLOSED',
      details: `[${violationCode}] ${details}`
    });
  }

  static getLogs(): TenantAuditLogEntry[] {
    return this.logs;
  }
}
