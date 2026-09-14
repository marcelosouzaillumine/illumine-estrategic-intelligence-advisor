import { DecisionCommandEnvelope, ExecutiveWorkflowContract } from '@illumine/executive-contracts';
import { ApprovalFlowEngine } from './ApprovalFlowEngine';
import { ExecutiveTrustLedgerEngine } from './ExecutiveTrustLedgerEngine';

export class ExecutiveWorkflowOrchestrator {
  public static orchestrateWorkflow(companyId: string, envelope: DecisionCommandEnvelope): ExecutiveWorkflowContract {
    const approvalReq = ApprovalFlowEngine.evaluateApprovalRequirement(envelope);
    const initialStatus = approvalReq.requiresHumanApproval ? 'PENDING' : 'APPROVED';

    const ledger = ExecutiveTrustLedgerEngine.recordEntry(envelope, initialStatus);

    return {
      workflowId: `wf-${companyId}-${envelope.decisionId}`,
      companyId,
      commandEnvelope: envelope,
      trustLedger: ledger,
      currentStage: approvalReq.requiresHumanApproval ? 'HUMAN_APPROVAL' : 'EXECUTIVE_EXECUTION',
      isCompleted: false
    };
  }
}
