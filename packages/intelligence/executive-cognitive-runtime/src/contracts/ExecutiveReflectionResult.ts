export enum ReflectionSeverity {
  NONE = "NONE",
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export interface ExecutiveReflectionResult {
  /**
   * The core assumptions that this reflection challenged.
   */
  assumptionsChallenged: string[];
  
  /**
   * Evidence that conflicts with the proposed consensus or recommendation.
   */
  conflictingEvidence: string[];
  
  /**
   * Potential risks that were ignored or underweighted in the initial debate.
   */
  ignoredRisks: string[];
  
  /**
   * Flag indicating if the consensus shows an unjustified optimism bias.
   */
  optimismBiasDetected: boolean;
  
  /**
   * Known weaknesses or blind spots in the recommendation.
   */
  recommendationWeaknesses: string[];
  
  /**
   * Mathematical adjustment to the overall confidence based on the reflection findings (can be negative).
   */
  confidenceAdjustment: number;

  /**
   * Overall severity of the reflection findings.
   */
  severity: ReflectionSeverity;
}
