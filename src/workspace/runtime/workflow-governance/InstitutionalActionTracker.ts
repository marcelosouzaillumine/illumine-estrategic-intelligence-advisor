import { ActionItem } from './WorkflowGovernanceTypes';
import { DecisionRecordRegistry } from './DecisionRecordRegistry';
import { WorkflowAuditLogger } from './WorkflowAuditLogger';

export class InstitutionalActionTracker {
  static createAction(
    tenantId: string,
    workflowId: string, 
    title: string, 
    responsibleUserId: string,
    relatedContext: { alertId?: string, scenarioId?: string }
  ): ActionItem {
    const action: ActionItem = {
      actionId: `ACT-${Date.now()}`,
      workflowId,
      title,
      responsibleUserId,
      status: 'OPEN',
      escalationLevel: 'NONE',
      relatedAlertId: relatedContext.alertId,
      relatedScenarioId: relatedContext.scenarioId
    };

    DecisionRecordRegistry.persistActionItem(action);
    
    // Auditamos a criação sem actor (automático do sistema) ou com actor SYSTEM
    WorkflowAuditLogger.logEvent(workflowId, tenantId, 'ACTION_ESCALATED', { userId: 'SYSTEM', role: 'SYSTEM', name: 'Engine' }, `Action Created: ${title}`);
    
    return action;
  }
}
