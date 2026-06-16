export type BalanceSheetIndicatorViewModel = {
  key: string;
  label: string;
  value: string | number;
  format?: string;
  rationale?: string;
  classification?: string;
  classificationLabel?: string;
  severity?: string;
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

export type BalanceSheetTechnicalIndicatorTone = 'critical' | 'warning' | 'success' | 'neutral';

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

export type BalanceSheetAuditOverrideViewModel = {
  overrideNameLabel: string;
  severityLabel: string;
};

export type BalanceSheetAuditStructuralRestrictionsViewModel = {
  overrides: BalanceSheetAuditOverrideViewModel[];
  originalClassificationLabel: string;
  classificationCeilingLabel: string;
};

export type BalanceSheetAuditConsistencyIssueViewModel = {
  type: 'critical' | 'warning' | 'disclosure';
  typeLabel: string;
  message: string;
  severity: "critical" | "warning" | "attention" | "info";
  severityLabel: string;
};

export type BalanceSheetAuditConsistencyViewModel = {
  statusLabel: string;
  statusTone: 'success' | 'critical' | 'warning' | 'attention' | 'neutral';
  hasIssues: boolean;
  issues: BalanceSheetAuditConsistencyIssueViewModel[];
};

export type BalanceSheetAuditLayerViewModel = {
  structuralRestrictions?: BalanceSheetAuditStructuralRestrictionsViewModel;
  governanceConsistency?: BalanceSheetAuditConsistencyViewModel;
  globalScore?: number;
  criticalOffenders?: BalanceSheetCriticalOffenderViewModel[];
};

export type BalanceSheetWaterfallPointViewModel = {
  name: string;
  value: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'critical' | 'neutral' | 'insufficient' | 'healthy' | 'excellent';
};

export type BalanceSheetWaterfallViewModel = {
  data: BalanceSheetWaterfallPointViewModel[];
  equityToAssetsPercentage: number;
};

export type BalanceSheetCompositionPointViewModel = {
  name: string;
  value: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'critical' | 'neutral' | 'insufficient' | 'healthy' | 'excellent';
};

export type BalanceSheetCompositionViewModel = {
  assetsData: BalanceSheetCompositionPointViewModel[];
  liabilitiesData: BalanceSheetCompositionPointViewModel[];
};

export type BalanceSheetEvolutionPointViewModel = {
  year: string | number;
  ativo: number;
  passivo: number;
  patrimonioLiquido: number;
};

export type BalanceSheetHighlightTone = 'positive' | 'negative' | 'neutral';

export type BalanceSheetHighlightViewModel = {
  label: string;
  valueFormatted: string;
  horizontalAnalysis: number;
  tone: BalanceSheetHighlightTone;
};

export type BalanceSheetEvolutionViewModel = {
  hasEnoughData: boolean;
  chartData: BalanceSheetEvolutionPointViewModel[];
  highlights: BalanceSheetHighlightViewModel[];
};

export type BalanceSheetStructuralRowViewModel = {
  label: string;
  valueFormatted: string;
  verticalAnalysis: number | null;
  horizontalAnalysis: number | null;
  level: number;
};

export type BalanceSheetStructuralSectionTone = 'assets' | 'liabilities' | 'equity';

export type BalanceSheetStructuralSectionViewModel = {
  titleLabel: string;
  tone: BalanceSheetStructuralSectionTone;
  rows: BalanceSheetStructuralRowViewModel[];
};

export type BalanceSheetStructuralTablesViewModel = {
  isEmpty: boolean;
  sections: BalanceSheetStructuralSectionViewModel[];
};

export type BalanceSheetFinancialAnalyticsViewModel = {
  waterfall: BalanceSheetWaterfallViewModel;
  composition: BalanceSheetCompositionViewModel;
  evolution: BalanceSheetEvolutionViewModel;
  structuralTables: BalanceSheetStructuralTablesViewModel;
};
