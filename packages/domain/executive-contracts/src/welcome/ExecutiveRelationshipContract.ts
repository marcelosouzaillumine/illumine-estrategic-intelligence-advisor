export interface ExecutiveRelationshipContract {
  readonly relationshipId: string;
  readonly relationshipScore: number;
  readonly trustScore: number;
  readonly sessionConsistencyScore: number;
  readonly consecutiveDaysCount: number;
  readonly lastMeaningfulInteractionDate: string;
  readonly engagementTrend: 'UPWARD' | 'STABLE' | 'ATTENTION_REQUIRED';
  readonly confidenceTrend: 'HIGH' | 'STABLE' | 'EVOLVING';
}
