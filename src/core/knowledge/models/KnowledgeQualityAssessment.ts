export interface KnowledgeQualityAssessment {
  score: number; // 0 to 100
  dimensions: {
    freshness: number;         // Degrades over time unless it's a permanent policy
    sourceReliability: number; // 100 for ERP, maybe 60 for unverified user chat
    validationLevel: number;   // Automatically parsed vs Human Reviewed
    usageHistory: number;      // Goes up if this knowledge is frequently used for successful decisions
  };
}
