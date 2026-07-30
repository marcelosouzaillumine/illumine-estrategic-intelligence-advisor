export interface OpportunityPredictionContract {
  readonly opportunityId: string;
  readonly title: string;
  readonly expectedGainValue: number;
  readonly probabilityPercent: number;
  readonly timeHorizonDays: number;
  readonly investmentRequiredValue: number;
  readonly confidenceScore: number;
  readonly affectedKPIs: readonly string[];
}
