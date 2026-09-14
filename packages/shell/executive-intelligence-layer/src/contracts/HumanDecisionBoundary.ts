export interface HumanDecisionBoundary {
  decisionRequired: boolean;
  decisionOwner: string;
  humanApprovalRequired: boolean;
  rationale: string;
  selectedOptionId: string;
  
  decisionAuthority: string;
  decisionTimestamp: Date;
  responsibilityAccepted: boolean;
  approvalEvidence: string;
  accountabilityRecord: string;
}
