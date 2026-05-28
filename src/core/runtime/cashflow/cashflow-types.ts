// src/core/runtime/cashflow/cashflow-types.ts

export type CashFlowPatternType = 
  | 'OPERACIONAL_SUSTENTAVEL'
  | 'OPERACIONAL_DEFICITARIO'
  | 'DEPENDENTE_TERCEIROS'
  | 'INVESTIMENTO_AGRESSIVO'
  | 'DESINVESTIMENTO'
  | 'LIQUIDEZ_CRISE'
  | 'INDISPONIVEL';

export interface CashConversionMetrics {
  ebitda: number;
  workingCapitalVariation: number;
  capex: number;
  operatingCashFlow: number;
  conversionRatio: number;
  qualityOfEarnings: 'ALTA' | 'MÉDIA' | 'BAIXA' | 'INSUFICIENTE';
}

export interface TreasuryPressureMetrics {
  debtService: number;
  availableCash: number;
  burnRate: number;
  runwayMonths: number;
  pressureLevel: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA';
}

export interface LiquiditySustainabilityMetrics {
  freeCashFlow: number;
  sustainabilityScore: number;
  status: 'SUSTENTÁVEL' | 'VULNERÁVEL' | 'INSUSTENTÁVEL';
}

export interface FundingDependencyMetrics {
  thirdPartyFunding: number;
  equityFunding: number;
  operationalFunding: number;
  dependencyStatus: 'AUTOFINANCIADA' | 'ALAVANCAGEM_CONTROLADA' | 'ALAVANCAGEM_CRÍTICA' | 'DEPENDÊNCIA_SÓCIOS';
}

export interface CashFlowOperationalMetrics {
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  pattern: CashFlowPatternType;
}

export interface CashFlowDiagnostics {
  isAvailable: boolean;
  operational: CashFlowOperationalMetrics | null;
  conversion: CashConversionMetrics | null;
  treasury: TreasuryPressureMetrics | null;
  sustainability: LiquiditySustainabilityMetrics | null;
  funding: FundingDependencyMetrics | null;
}

export interface ConsolidatedCashFlowReport {
  isAvailable: boolean;
  overallNarrative: string;
  operational: any;
  conversion: any;
  treasury: any;
  sustainability: any;
  funding: any;
}
