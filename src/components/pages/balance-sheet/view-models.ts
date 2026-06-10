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

export type BalanceSheetTechnicalIndicatorTone = 'critical' | 'warning' | 'success' | 'info' | 'neutral' | 'insufficient';

export type BalanceSheetTechnicalIndicatorViewModel = {
  label: string;
  classificationLabel: string;
  classificationTone: BalanceSheetTechnicalIndicatorTone;
  formattedValue: string;
  confidence?: number;
  rationale?: string;
};

export type BalanceSheetTechnicalFamilyViewModel = {
  familyName: string;
  indicators: BalanceSheetTechnicalIndicatorViewModel[];
};

export type BalanceSheetTechnicalLayerViewModel = {
  families: BalanceSheetTechnicalFamilyViewModel[];
};
