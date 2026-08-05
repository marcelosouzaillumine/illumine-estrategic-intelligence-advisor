export interface ExecutiveDecisionArtifact {
  decisionId: string;
  artifactId: string; // Refers to the IntelligenceArtifact ID (e.g. the recommendation)
  approvedBy: string; // Advisor ID
  decisionContext: string; // The advisor's contextual note or justification
  chosenAction: string; // What action was decided
  rejectedAlternatives: string[]; // Options considered but dismissed
  expectedOutcome: string; // Business outcome projected by this decision
  reviewDate: Date; // Future date to evaluate the Outcome Assessment
  createdAt: Date;
}
