export interface ExecutivePolicyContract {
  readonly policyId: string;
  readonly policyName: string;
  readonly isExecutionAllowed: boolean;
  readonly requiresHumanApproval: boolean;
  readonly complianceLevel: 'FULL' | 'RESTRICTED' | 'BLOCKED';
  readonly policyReason: string;
  readonly evaluatedAt: string;
}
