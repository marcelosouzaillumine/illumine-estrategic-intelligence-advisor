export type ExecutiveStageType = 'LEAD' | 'MQL' | 'SQL' | 'DIAGNOSTIC' | 'EXECUTIVE_DEMO' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST' | 'EXPANSION' | 'RENEWAL';

export interface CRMOpportunityItem {
  readonly opportunityId: string;
  readonly companyName: string;
  readonly stage: ExecutiveStageType;
  readonly expectedValue: number;
  readonly winProbabilityPercent: number;
  readonly assignedOwner: string;
  readonly nextRequiredAction: string;
  readonly riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ExecutiveCRMContract {
  readonly crmBatchId: string;
  readonly opportunities: readonly CRMOpportunityItem[];
  readonly totalPipelineValue: number;
  readonly weightedPipelineValue: number;
  readonly generatedAt: string;
}
