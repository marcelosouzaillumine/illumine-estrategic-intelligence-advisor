export interface ContextMemoryContract {
  readonly memoryId: string;
  readonly companyId: string;
  readonly decisionContextId: string;
  readonly indexedConcepts: readonly string[];
  readonly causalImpactObserved: string;
  readonly recordedAt: string;
}
