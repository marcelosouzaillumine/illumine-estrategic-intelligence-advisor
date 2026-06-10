export type BalanceSheetIndicatorViewModel = {
  key: string;
  label: string;
  value: string | number;
  format?: string;
  rationale?: string;
};

export type BalanceSheetCriticalOffenderViewModel = {
  metricName: string;
  classification: string;
  impact: string;
};

export type BalanceSheetRiskDivergenceTone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'critical';

export type BalanceSheetRiskDivergenceViewModel = {
  mathClassificationLabel: string;
  fiduciaryClassificationLabel: string;
  fiduciaryClassificationTone: BalanceSheetRiskDivergenceTone;
  globalScore: number;
  criticalOffenders: BalanceSheetCriticalOffenderViewModel[];
};

export type BalanceSheetInstitutionalContextViewModel = {
  segment: string;
  businessModel: string;
  capitalIntensity: string;
  stage: string;
};
