export type DREEconomicDiagnosisInput = {
  valueCreationAssessment: string;
  primaryConstraint: string;
  recoverabilityAssessment: string;
  strategicPriority: string;
  boardOutlook: string;
};

export type DRERevenueEconomicStructureInput = {
  available: boolean;
  reason?: string;
  value?: {
    narrativa: string;
  };
};

export type DREEconomicBurnRateInput = {
  available: boolean;
  reason?: string;
  value?: {
    narrativa: string;
    monthlyEconomicBurn: number | null;
    annualEconomicBurn: number | null;
  };
};

export type DREBreakEvenAnalysisInput = {
  available: boolean;
  reason?: string;
  value?: {
    narrativa: string;
    breakEvenRevenue: number;
  };
};

export type DREOperationalAbsorptionInput = {
  available: boolean;
  value?: {
    classificacao: string;
  };
};

export type DREBoardDecisionSupportInput = {
  criacaoDeValor?: string;
  geraValor?: string;
  faturamentoSustaenta?: string;
  problemaPrincipal?: string;
  lacunaEquilibrio?: string;
  restricaoPrincipal?: string;
  oportunidadePrincipal?: string;
  consequenciaDaInacao?: string;
  risco?: string;
  prioridadeConselho?: string;
  prioridade?: string;
};

export type DREExecutiveAdvisoryFullInput = {
  situacaoAtual: string;
  restricaoPrincipal: string;
  oportunidadePrincipal: string;
  prioridadeEstrategica: string;
  outlook: string;
};

export type DREScaleEfficiencyInput = {
  colorClass?: string;
  category: string;
  recGrowth: number | null;
  ebitdaGrowth: number | null;
  description: string;
};

export type DREEarningsQualityAssessmentInput = {
  classification: string;
  rationale: string;
  recurringRevenueWeight: number;
  nonRecurringWeight: number;
};

export type DRETechnicalRowInput = {
  name: string;
  conta?: string;
  category?: string;
  val: number;
  level: number;
  av: number;
  ah1: number | null;
  ah2: number | null;
  ah3: number | null;
};
export type DREHighlightsInput = {
  receitaBruta: number;
  deducoesReceita: number;
  recLiquida: number;
  custosVar: number;
  margemContrib: number;
  despesasFixas: number;
  pontoEquilibrio: number;
  gapEquilibrio: number;
  margemSegurancaValor: number;
  indiceCoberturaOperacional: number;
  indiceMargemContrib: number;
  cmvLabel: string;
  hasRealData: boolean;
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
