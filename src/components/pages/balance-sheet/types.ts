export interface BalanceSheetIndicator {
  metricName: string;
  value: string | number;
  format?: string;
  rationale?: string;
  classification?: string;
}

export type BalanceSheetInstitutionalContextInput = {
  segment?: string;
  businessModel?: string;
  capitalIntensity?: string;
  stage?: string;
};
