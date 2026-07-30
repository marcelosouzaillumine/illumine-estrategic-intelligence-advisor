export interface RiskPredictionContract {
  readonly riskId: string;
  readonly title: string;
  readonly riskCategory: 'CASH_SHORTAGE' | 'MARGIN_COMPRESSION' | 'WORKING_CAPITAL_STRESS' | 'BANK_RISK' | 'OPERATIONAL_RISK';
  readonly probabilityPercent: number;
  readonly impactSeverity: 'HIGH' | 'MEDIUM' | 'LOW';
  readonly timeHorizonDays: number;
  readonly expectedFinancialImpact: number;
  readonly leadingIndicators: readonly string[];
  readonly confidenceScore: number;
}
