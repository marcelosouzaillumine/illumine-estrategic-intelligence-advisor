export interface BalanceSheetIndicator {
  metricName: string;
  value: string | number;
  format?: string;
  rationale?: string;
  classification?: string;
  family?: string;
  severity?: string;
  confidence?: number;
}

export type BalanceSheetInstitutionalContextInput = {
  segment?: string;
  businessModel?: string;
  capitalIntensity?: string;
  stage?: string;
};
