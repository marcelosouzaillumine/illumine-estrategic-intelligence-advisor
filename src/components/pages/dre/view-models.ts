export type DREEconomicDiagnosisViewModel = {
  valueCreationAssessment: string;
  primaryConstraint: string;
  recoverabilityAssessment: string;
  strategicPriority: string;
  boardOutlook: string;
};

export type DRERevenueEconomicStructureViewModel = {
  available: boolean;
  reason?: 'INSUFFICIENT_HISTORY' | 'INSUFFICIENT_DATA' | 'NOT_APPLICABLE';
  narrative?: string;
};

export type DREEconomicBurnRateViewModel = {
  available: boolean;
  reason?: 'INSUFFICIENT_HISTORY' | 'INSUFFICIENT_DATA' | 'NOT_APPLICABLE';
  narrative?: string;
  monthlyEconomicBurnFormatted?: string;
  annualEconomicBurnFormatted?: string;
  hasBurn: boolean;
};

export type DREBreakEvenAnalysisViewModel = {
  available: boolean;
  reason?: 'INSUFFICIENT_HISTORY' | 'INSUFFICIENT_DATA' | 'NOT_APPLICABLE';
  narrative?: string;
  absorptionClassification?: string;
  absorptionTone?: 'success' | 'warning' | 'critical';
};

export type DREBoardDecisionSupportViewModel = {
  valueCreationLabel: string;
  valueCreationTone: 'success' | 'critical';
  sustainabilityLabel: string;
  balanceGapLabel: string;
  primaryConstraintLabel: string;
  primaryOpportunityLabel: string;
  inactionConsequenceLabel: string;
  inactionTone: 'success' | 'critical';
  boardPriorityLabel: string;
};

export type DREExecutiveAdvisorySectionViewModel = {
  hasFullAdvisory: boolean;
  situacaoAtual?: string;
  restricaoPrincipal?: string;
  oportunidadePrincipal?: string;
  prioridadeEstrategica?: string;
  outlook?: string;
  simpleAdvisoryText?: string;
};

export type DREScaleEfficiencyViewModel = {
  classificationLabel: string;
  toneClass: string;
  recGrowthFormatted: string;
  recGrowthTone: 'success' | 'critical';
  ebitdaGrowthFormatted: string;
  ebitdaGrowthTone: 'success' | 'critical';
  description: string;
};

export type DREEarningsQualityAssessmentViewModel = {
  classificationTitle: string;
  classificationTone: 'success' | 'critical' | 'neutral' | 'warning';
  rationale: string;
  recurringRevenueWeight: number;
  nonRecurringWeight: number;
};

export type DREHighlightsViewModel = {
  receitaBrutaFormatted: string;
  deducoesReceitaFormatted: string;
  recLiquidaFormatted: string;
  custosVarFormatted: string;
  cmvLabel: string;
  margemContribFormatted: string;
  margemContribPercent: string;
  despesasFixasFormatted: string;
  pontoEquilibrioFormatted: string;
  gapEquilibrioFormatted: string;
  margemSegurancaValorFormatted: string;
  indiceCoberturaOperacionalFormatted: string;
  coberturaTone: 'success' | 'info' | 'warning' | 'critical';
};

export type DREChartPointViewModel = {
  year: string | number;
  receita: number;
  cmv: number;
  ebitda: number;
  lucro: number;
};

export type DREChartsSectionViewModel = {
  data: DREChartPointViewModel[];
  cmvLabel: string;
};

export type DRETechnicalRowViewModel = {
  label: string;
  val: number;
  av: number;
  ah1: number | null;
  ah2: number | null;
  ah3: number | null;
  level: number;
  isTotal: boolean;
};

export type DRETechnicalLayerViewModel = {
  rows: DRETechnicalRowViewModel[];
};
