export interface RecommendationContext {
  readonly capabilityId: string;
  readonly architectureState: string;
  readonly memoryReferences: readonly string[];
  readonly decisionHistory: readonly string[];
  readonly certificationHistory: readonly string[];
  readonly exposureAssessment: readonly string[];
  readonly evolutionTrajectory: readonly string[];
  readonly constraints: readonly string[];
}
