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

export type BalanceSheetWaterfallInputPoint = {
  name: string;
  value: number;
  fill?: string;
};

export type BalanceSheetCompositionInputPoint = {
  name: string;
  value: number;
  fill?: string;
};

export type BalanceSheetEvolutionInputPoint = {
  year: string | number;
  ativo: number;
  passivo: number;
  pl: number;
};

export type BalanceSheetMajorChangeInput = {
  name?: string;
  conta?: string;
  val: number;
  ah: number;
};

export type BalanceSheetComparativeRowInput = {
  name?: string;
  conta?: string;
  val: number;
  av: number | null;
  ah: number | null;
  level: number;
  tipo?: string;
  type?: string;
};

export type BalanceSheetSummaryInput = {
  ativoTotal: number;
  patrimonioLiquido: number;
};
