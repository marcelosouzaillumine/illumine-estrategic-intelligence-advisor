export interface EntityResolutionContract {
  readonly resolutionId: string;
  readonly canonicalEntityId: string;
  readonly sourceSystemId: string;
  readonly externalEntityId: string;
  readonly matchConfidencePercent: number;
  readonly resolutionStrategy: 'EXACT_TAX_ID' | 'FUZZY_NAME_MATCH' | 'SEMANTIC_IDENTITY';
}
