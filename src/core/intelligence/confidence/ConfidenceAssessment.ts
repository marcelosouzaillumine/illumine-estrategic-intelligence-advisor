export interface ConfidenceAssessment {
  score: number; // 0-100 overall confidence
  dimensions: {
    evidence: number; // Quality and quantity of evidence
    dataQuality: number; // Trust in the underlying data sources
    reasoning: number; // Algorithmic certainty
    historicalAccuracy: number; // Past accuracy of this artifact type
  };
  explanation: string; // Human-readable explanation of why this confidence level was assigned
  uncertaintyFactors: string[]; // Known missing data or variables reducing confidence
}
