export type InstitutionalMilestoneType = 
  | 'CONSTITUTIONAL_BREAK' 
  | 'STRATEGIC_INFLECTION' 
  | 'RISK_EMERGENCE' 
  | 'GOVERNANCE_CHANGE' 
  | 'CAPITAL_EVENT' 
  | 'BOARD_DECISION';

export interface InstitutionalMilestone {
  milestoneId: string;
  tenantId: string;
  milestoneType: InstitutionalMilestoneType;
  title: string;
  description: string;
  sourceNodeId: string;
  relatedSnapshotId: string;
  timestamp: string;
}
