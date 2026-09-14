import { logger } from "../../../services/logging/InstitutionalLogger";
import { WorkflowAuditRecord, WorkflowActor } from './WorkflowGovernanceTypes';

export class WorkflowAuditLogger {
  private static logs: WorkflowAuditRecord[] = [];

  static logEvent(
    workflowId: string, 
    tenantId: string, 
    event: WorkflowAuditRecord['event'], 
    actor: WorkflowActor, 
    details?: string
  ) {
    const record: WorkflowAuditRecord = {
      auditId: `WFAUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      workflowId,
      tenantId,
      event,
      actor,
      timestamp: new Date().toISOString(),
      details
    };
    
    this.logs.push(record);
    logger.audit('Workflow Audit Event', { event, workflowId, actorRole: actor.role });
  }

  static getLogsForTenant(tenantId: string): WorkflowAuditRecord[] {
    return this.logs.filter(l => l.tenantId === tenantId);
  }

  static clearMockDataForTenant(tenantId: string) {
    this.logs = this.logs.filter(l => l.tenantId !== tenantId);
  }
}
