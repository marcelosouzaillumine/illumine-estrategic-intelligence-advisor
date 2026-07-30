export interface ExecutiveContextEnvelope {
  readonly contextId: string;
  readonly companyId: string;
  readonly activeDomain: string;
  readonly strategicObjectives: readonly string[];
  readonly riskProfile: string;
  readonly historicalContextSummary: string;
  readonly wisdomReferenceIds: readonly string[];
  readonly assembledAt: string;
  readonly isValidated: boolean;
}
