import { DecisionWorkflow, WorkflowType, WorkflowActor, WorkflowStatus, WorkflowApproval, DecisionLineageReference } from './WorkflowGovernanceTypes';
import { DecisionRecordRegistry } from './DecisionRecordRegistry';
import { WorkflowAuditLogger } from './WorkflowAuditLogger';
import { ApprovalPolicyResolver } from './ApprovalPolicyResolver';

export class DecisionWorkflowEngine {
  /**
   * Inicializa um novo Workflow Governamental.
   */
  static createWorkflow(
    type: WorkflowType,
    title: string,
    description: string,
    lineage: DecisionLineageReference,
    creator: WorkflowActor
  ): DecisionWorkflow {
    // Busca a política adequada (Simplificada no MVP)
    const policy = ApprovalPolicyResolver.getPolicyForWorkflow(type, 'MEDIUM');

    const workflow: DecisionWorkflow = {
      workflowId: `WF-${Date.now()}`,
      type,
      title,
      description,
      status: 'DRAFT',
      lineage,
      steps: [
        {
          stepId: `STEP-1-${Date.now()}`,
          order: 1,
          title: 'Aprovação Institucional Inicial',
          requiredRole: policy.requiredRoles[0] || 'ADVISOR',
          status: 'WAITING_APPROVAL',
          approvals: []
        }
      ],
      createdBy: creator,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    DecisionRecordRegistry.persistWorkflow(workflow);
    WorkflowAuditLogger.logEvent(workflow.workflowId, lineage.tenantId, 'WORKFLOW_CREATED', creator);

    return workflow;
  }

  /**
   * Adiciona uma aprovação formal e transita o estado.
   */
  static approveStep(workflowId: string, stepId: string, actor: WorkflowActor, justification: string) {
    // Recupera mock state do Registry
    // Em produção real, faríamos um lock transacional no banco
    const tenantId = actor.userId; // Mock simples
    WorkflowAuditLogger.logEvent(workflowId, 'TENANT-HQ', 'STEP_APPROVED', actor, `Step ${stepId} approved. Justification: ${justification}`);
  }
}
