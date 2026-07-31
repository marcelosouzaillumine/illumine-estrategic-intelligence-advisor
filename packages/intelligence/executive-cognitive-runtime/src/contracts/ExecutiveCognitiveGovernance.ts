export interface CognitiveGovernanceScore {
  /**
   * Overall score 0-100
   */
  overallScore: number;
  
  /**
   * Evidence Quality (Weight: 20%)
   * Measures the depth, origin and reliability of the data supporting the decision.
   */
  evidenceQuality: number;
  
  /**
   * Reasoning Completeness (Weight: 20%)
   * Measures if the causal chain is fully connected without leaps of faith.
   */
  reasoningCompleteness: number;
  
  /**
   * Contradiction Analysis (Weight: 15%)
   * Measures if opposing scenarios were fully debated and resolved or documented.
   */
  contradictionAnalysis: number;
  
  /**
   * Agent Diversity (Weight: 15%)
   * Measures how many specialized agents participated in the debate and brought unique perspectives.
   */
  agentDiversity: number;
  
  /**
   * Historical Validation (Weight: 15%)
   * Measures how well the decision aligns with institutional memory and previous learnings.
   */
  historicalValidation: number;
  
  /**
   * Reflection Quality (Weight: 15%)
   * Measures the depth of the self-doubt applied to the consensus.
   */
  reflectionQuality: number;
  
  /**
   * Key strengths found by the metacognitive assessment
   */
  strengths: string[];
  
  /**
   * Key warnings or biases detected
   */
  warnings: string[];
}

export interface CognitiveGovernanceAudit {
  score: CognitiveGovernanceScore;
  auditTimestamp: number;
  isCertified: boolean;
  blockReason?: string;
}

export interface CognitiveGovernanceDecision {
  status: "APPROVED" | "APPROVED_WITH_WARNING" | "REQUIRES_HUMAN_REVIEW" | "BLOCKED";
  governanceScore: number;
  blockingReasons: string[];
  warnings: string[];
  requiredActions: string[];
  evaluatedPackageVersion: string;
  evaluatedAt: Date;
}
