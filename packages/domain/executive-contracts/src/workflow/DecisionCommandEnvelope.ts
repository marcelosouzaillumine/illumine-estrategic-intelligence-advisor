export type WorkflowRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DecisionCommandEnvelope {
  readonly decisionId: string;
  readonly sourceAgent: string;
  readonly confidenceScore: number;
  readonly impactedDomains: readonly ('FINANCIAL' | 'COMMERCIAL' | 'OPERATIONAL' | 'PEOPLE' | 'RISK')[];
  readonly expectedOutcome: string;
  readonly riskLevel: WorkflowRiskLevel;
  readonly requiredApproval: 'AUTOMATIC' | 'MANAGER' | 'EXECUTIVE' | 'BOARD';
  readonly expirationDate: string;
  readonly createdAt: string;
}
