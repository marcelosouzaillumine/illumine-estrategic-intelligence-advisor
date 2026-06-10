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

export type BalanceSheetAuditOverrideInput = {
  name: string;
  severity: string;
};

export type BalanceSheetStructuralRestrictionsInput = {
  appliedOverrides?: BalanceSheetAuditOverrideInput[];
  originalClassification: string;
  classificationCeiling?: string;
};

export type BalanceSheetGovernanceConsistencyInput = {
  consistencyStatus: string;
  detectedIssues: string[];
  warnings: string[];
  forcedDisclosures: string[];
};
