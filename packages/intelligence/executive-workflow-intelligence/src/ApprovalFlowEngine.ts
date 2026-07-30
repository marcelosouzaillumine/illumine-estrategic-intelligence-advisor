import { DecisionCommandEnvelope } from '@illumine/executive-contracts';

export class ApprovalFlowEngine {
  public static evaluateApprovalRequirement(envelope: DecisionCommandEnvelope): {
    readonly requiresHumanApproval: boolean;
    readonly requiredRole: 'NONE' | 'FINANCIAL_MANAGER' | 'EXECUTIVE' | 'BOARD';
  } {
    switch (envelope.riskLevel) {
      case 'LOW':
        return { requiresHumanApproval: false, requiredRole: 'NONE' };
      case 'MEDIUM':
        return { requiresHumanApproval: true, requiredRole: 'FINANCIAL_MANAGER' };
      case 'HIGH':
        return { requiresHumanApproval: true, requiredRole: 'EXECUTIVE' };
      case 'CRITICAL':
        return { requiresHumanApproval: true, requiredRole: 'BOARD' };
      default:
        return { requiresHumanApproval: true, requiredRole: 'BOARD' };
    }
  }
}
