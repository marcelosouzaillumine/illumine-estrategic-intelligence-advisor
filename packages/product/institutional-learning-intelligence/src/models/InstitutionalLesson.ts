export interface InstitutionalLesson {
  readonly lessonId: string;
  readonly sourceDecisionId: string;
  readonly observation: {
    readonly expectedOutcome: string;
    readonly actualOutcome: string;
    readonly variance: string; // Ex: "Underperformed by 20%", "Delayed by 2 months"
  };
  readonly learning: {
    readonly whatWorked: readonly string[];
    readonly whatFailed: readonly string[];
    readonly principleGenerated: string; // Ex: "Prioritize operational capacity over rapid expansion"
  };
  readonly applicability: {
    readonly domains: readonly string[];
    readonly futureContexts: readonly string[];
  };
  readonly confidence: {
    readonly level: 'emerging' | 'validated' | 'established';
    readonly evidenceCount: number;
  };
  readonly temporalContext: {
    readonly createdAt: string;
    readonly applicableUntil?: string;
  };
  readonly scope: {
    readonly domains: readonly string[];
    readonly industries?: readonly string[];
  };
  readonly tenantId: string;
}
