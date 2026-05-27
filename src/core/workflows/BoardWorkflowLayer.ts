import { DataAccessContext } from '../security/data-access-context';
import { AuditEventBus } from '../security/audit/AuditEventBus';

export type WorkflowState =
  | 'INIT'
  | 'BOARD_REVIEW'
  | 'CFO_APPROVAL'
  | 'GOVERNANCE_ESCALATION'
  | 'SIMULATION_APPROVAL'
  | 'ADVISORY_ESCALATION'
  | 'EXECUTIVE_SIGN_OFF'
  | 'INSTITUTIONAL_ACKNOWLEDGEMENT'
  | 'APPROVED'
  | 'REJECTED';

export interface BoardWorkflow {
  workflowId: string;
  tenantId: string;
  currentState: WorkflowState;
  resourceId: string;
  resourceType: string;
  lineageReference: string;
  correlationId: string;
  updatedBy: string;
  updatedAt: string;
}

export class BoardWorkflowLayer {
  private static workflows: BoardWorkflow[] = [];

  public static clearWorkflows() {
    this.workflows = [];
  }

  public static getWorkflow(workflowId: string): BoardWorkflow {
    const wf = this.workflows.find(w => w.workflowId === workflowId);
    if (!wf) {
      throw new Error(`[Board Workflow] Workflow ${workflowId} não encontrado.`);
    }
    return { ...wf };
  }

  /**
   * Validates if a transition is allowed based on the actor's institutional role.
   */
  public static validateTransition(context: DataAccessContext, fromState: WorkflowState, toState: WorkflowState): void {
    if (!context || !context.role) {
      throw new Error('Acesso negado: Contexto incompleto.');
    }

    // Role restrictions for critical states
    if (toState === 'CFO_APPROVAL') {
      if (context.role !== 'CFO' && context.role !== 'SUPER_ADMIN') {
        throw new Error('[Board Workflow] Acesso negado: CFO_APPROVAL exige papel de CFO.');
      }
    }

    if (toState === 'EXECUTIVE_SIGN_OFF') {
      if (context.role !== 'CFO' && context.role !== 'SUPER_ADMIN') {
        throw new Error('[Board Workflow] Acesso negado: EXECUTIVE_SIGN_OFF exige papel de CFO ou SUPER_ADMIN.');
      }
    }

    if (toState === 'BOARD_REVIEW' || toState === 'SIMULATION_APPROVAL') {
      if (context.role !== 'BOARD_MEMBER' && context.role !== 'CFO' && context.role !== 'SUPER_ADMIN') {
        throw new Error('[Board Workflow] Acesso negado: Papel não autorizado para aprovação de conselho.');
      }
    }
  }

  /**
   * Creates/Starts a workflow.
   */
  public static startWorkflow(
    context: DataAccessContext,
    resourceId: string,
    resourceType: string
  ): BoardWorkflow {
    if (!context || !context.tenantId) {
      throw new Error('Acesso negado: Contexto incompleto.');
    }

    const workflow: BoardWorkflow = {
      workflowId: `wf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId: context.tenantId,
      currentState: 'BOARD_REVIEW',
      resourceId,
      resourceType,
      lineageReference: context.lineageHash || 'N/A',
      correlationId: context.correlationId || 'N/A',
      updatedBy: context.actorId,
      updatedAt: new Date().toISOString()
    };

    this.workflows.push(workflow);

    AuditEventBus.emit({
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      sessionId: context.sessionId || 'N/A',
      eventType: 'WORKFLOW_STARTED',
      resourceType: 'Workflow',
      resourceId: workflow.workflowId,
      correlationId: workflow.correlationId,
      lineageReference: workflow.lineageReference,
      auditSeverity: 'INFO',
      requestSource: 'BoardWorkflowLayer',
      metadata: { resourceId, resourceType, state: 'BOARD_REVIEW' }
    });

    return workflow;
  }

  /**
   * Approves a step and transitions the workflow.
   */
  public static approveStep(context: DataAccessContext, workflowId: string, nextState: WorkflowState): BoardWorkflow {
    const idx = this.workflows.findIndex(w => w.workflowId === workflowId);
    if (idx === -1) {
      throw new Error(`[Board Workflow] Workflow ${workflowId} não encontrado.`);
    }

    const wf = this.workflows[idx];
    if (wf.tenantId !== context.tenantId) {
      throw new Error('[Board Workflow] Rejeitado: Acesso cross-tenant negado.');
    }

    this.validateTransition(context, wf.currentState, nextState);

    wf.currentState = nextState;
    wf.updatedBy = context.actorId;
    wf.updatedAt = new Date().toISOString();
    if (context.lineageHash) {
      wf.lineageReference = context.lineageHash;
    }
    if (context.correlationId) {
      wf.correlationId = context.correlationId;
    }

    AuditEventBus.emit({
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      sessionId: context.sessionId || 'N/A',
      eventType: `WORKFLOW_TRANSITION_${nextState}`,
      resourceType: 'Workflow',
      resourceId: workflowId,
      correlationId: wf.correlationId,
      lineageReference: wf.lineageReference,
      auditSeverity: nextState === 'CFO_APPROVAL' || nextState === 'EXECUTIVE_SIGN_OFF' ? 'CRITICAL' : 'INFO',
      requestSource: 'BoardWorkflowLayer',
      metadata: { fromState: wf.currentState, toState: nextState }
    });

    return wf;
  }

  /**
   * Rejects a step and transitions to REJECTED.
   */
  public static rejectStep(context: DataAccessContext, workflowId: string, reason: string): BoardWorkflow {
    const idx = this.workflows.findIndex(w => w.workflowId === workflowId);
    if (idx === -1) {
      throw new Error(`[Board Workflow] Workflow ${workflowId} não encontrado.`);
    }

    const wf = this.workflows[idx];
    if (wf.tenantId !== context.tenantId) {
      throw new Error('[Board Workflow] Rejeitado: Acesso cross-tenant negado.');
    }

    wf.currentState = 'REJECTED';
    wf.updatedBy = context.actorId;
    wf.updatedAt = new Date().toISOString();

    AuditEventBus.emit({
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      sessionId: context.sessionId || 'N/A',
      eventType: 'WORKFLOW_STEP_REJECTED',
      resourceType: 'Workflow',
      resourceId: workflowId,
      correlationId: wf.correlationId,
      lineageReference: wf.lineageReference,
      auditSeverity: 'WARNING',
      requestSource: 'BoardWorkflowLayer',
      metadata: { reason }
    });

    return wf;
  }

  /**
   * Escalates a workflow to governance/advisory escalations.
   */
  public static escalateWorkflow(context: DataAccessContext, workflowId: string, escalationType: 'GOVERNANCE_ESCALATION' | 'ADVISORY_ESCALATION'): BoardWorkflow {
    const idx = this.workflows.findIndex(w => w.workflowId === workflowId);
    if (idx === -1) {
      throw new Error(`[Board Workflow] Workflow ${workflowId} não encontrado.`);
    }

    const wf = this.workflows[idx];
    if (wf.tenantId !== context.tenantId) {
      throw new Error('[Board Workflow] Rejeitado: Acesso cross-tenant negado.');
    }

    wf.currentState = escalationType;
    wf.updatedBy = context.actorId;
    wf.updatedAt = new Date().toISOString();

    AuditEventBus.emit({
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      sessionId: context.sessionId || 'N/A',
      eventType: `WORKFLOW_ESCALATION_${escalationType}`,
      resourceType: 'Workflow',
      resourceId: workflowId,
      correlationId: wf.correlationId,
      lineageReference: wf.lineageReference,
      auditSeverity: 'WARNING',
      requestSource: 'BoardWorkflowLayer'
    });

    return wf;
  }
}
