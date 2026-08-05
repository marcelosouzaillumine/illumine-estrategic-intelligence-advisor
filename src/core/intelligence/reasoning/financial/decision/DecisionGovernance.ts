export interface DecisionGovernance {
  requiresHumanApproval: boolean;
  evidence: string[];
  confidence: number;
  limitations: string[];
  originFact?: string; // Links back to the original factual data
  knowledgeReference?: string; // The specific knowledge pack rule/principle used
}
