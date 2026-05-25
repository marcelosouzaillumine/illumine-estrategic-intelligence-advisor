import { ApprovalPolicy, WorkflowType } from './WorkflowGovernanceTypes';

export class ApprovalPolicyResolver {
  static getPolicyForWorkflow(type: WorkflowType, riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): ApprovalPolicy {
    // Regras rígidas fiduciárias
    if (type === 'ALERT_RESPONSE' && riskLevel === 'CRITICAL') {
      return {
        policyId: `POL-${Date.now()}`,
        workflowType: type,
        requiredRoles: ['BOARD_MEMBER', 'CONTROLLER', 'ADVISOR'],
        quorum: 2
      };
    }
    
    if (type === 'BOARD_PACK_APPROVAL') {
      return {
        policyId: `POL-${Date.now()}`,
        workflowType: type,
        requiredRoles: ['BOARD_MEMBER'],
        quorum: 1
      };
    }

    // Default genérico
    return {
      policyId: `POL-DEFAULT`,
      workflowType: type,
      requiredRoles: ['ADVISOR'],
      quorum: 1
    };
  }
}
