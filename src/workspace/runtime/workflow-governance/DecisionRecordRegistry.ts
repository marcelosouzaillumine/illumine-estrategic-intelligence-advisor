import { DecisionWorkflow, ActionItem, InstitutionalDeliberation } from './WorkflowGovernanceTypes';

export class DecisionRecordRegistry {
  private static workflows: DecisionWorkflow[] = [];
  private static actionItems: ActionItem[] = [];
  private static deliberations: InstitutionalDeliberation[] = [];

  static persistWorkflow(workflow: DecisionWorkflow) {
    // Append-only (mock behavior for MVP)
    this.workflows.push(workflow);
  }

  static updateWorkflow(workflow: DecisionWorkflow) {
    // Overrides existing to simulate state change, but in production
    // it would be append-only with versioning.
    const index = this.workflows.findIndex(w => w.workflowId === workflow.workflowId);
    if (index >= 0) {
      this.workflows[index] = workflow;
    }
  }

  static persistActionItem(action: ActionItem) {
    this.actionItems.push(action);
  }

  static persistDeliberation(deliberation: InstitutionalDeliberation) {
    this.deliberations.push(deliberation);
  }

  static getWorkflowsForTenant(tenantId: string, workspaceId: string): DecisionWorkflow[] {
    return this.workflows.filter(w => w.lineage.tenantId === tenantId && w.lineage.workspaceId === workspaceId);
  }

  static getActionItemsForWorkflow(workflowId: string): ActionItem[] {
    return this.actionItems.filter(a => a.workflowId === workflowId);
  }

  static clearMockDataForTenant(tenantId: string) {
    this.workflows = this.workflows.filter(w => w.lineage.tenantId !== tenantId);
  }
}
