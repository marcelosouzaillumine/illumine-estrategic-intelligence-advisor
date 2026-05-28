export interface CashFlowOperationalMetrics {
  operatingCashFlow: number;
  ebitda: number;
  ebitdaToCashConversion: number | null; // operatingCashFlow / ebitda
  ebitdaConversionQuality: 'EXCELENTE' | 'SAUDÁVEL' | 'LIMITADA' | 'CRÍTICA' | 'FALTA_DADO';
  selfSufficiencyIndex: number | null; // operatingCashFlow / fixedCashOutflows or totalOutflows
  isSelfSustained: boolean;
  narrative: string;
}

export interface CashConversionMetrics {
  receivablesAging: number;
  payablesAging: number;
  cashConversionCycleDays: number | null;
  conversionEfficiency: 'ALTA' | 'MODERADA' | 'LENTA' | 'PRESIONADA' | 'FALTA_DADO';
  inventoryDrainImpact: number | null; // inventory pressure on cash flow
  isGrowthConsumingLiquidity: boolean;
  narrative: string;
}

export interface TreasuryPressureMetrics {
  currentCashBalance: number;
  monthlyCashBurnRate: number;
  runwayMonths: number | null;
  runwayClassification: 'RUNWAY_SAUDAVEL' | 'RUNWAY_LIMITADO' | 'RUNWAY_CRITICO' | 'EXCESSO_CAIXA' | 'FALTA_DADO';
  daysToRupture: number | null;
  shortTermObligations: number;
  pressureRatio: number;
  pressureClassification: 'BAIXA' | 'SENSÍVEL' | 'ELEVADA' | 'SEVERA' | 'FALTA_DADO';
  narrative: string;
}

export interface LiquiditySustainabilityMetrics {
  lcr: number | null; // Liquidity Coverage Ratio
  sustainabilityScore: number; // 0-100
  sustainabilityClassification: 'SUSTENTÁVEL' | 'SENSÍVEL' | 'FRÁGIL' | 'VULNERÁVEL' | 'FALTA_DADO';
  operationalCoverageMonths: number | null;
  narrative: string;
}

export interface FundingDependencyMetrics {
  fundingInflows: number;
  partnerInjections: number;
  totalExternalFunding: number;
  dependencyClassification: 'NENHUMA' | 'BAIXA' | 'MODERADA' | 'ELEVADA' | 'CRÍTICA' | 'FALTA_DADO';
  fundingDependencyRatio: number | null; // totalExternalFunding / (totalExternalFunding + operatingCashFlow)
  debtAmortizationCoverage: number | null;
  narrative: string;
}

export interface ConsolidatedCashFlowReport {
  isAvailable: boolean;
  operational: CashFlowOperationalMetrics;
  conversion: CashConversionMetrics;
  treasury: TreasuryPressureMetrics;
  liquidity: LiquiditySustainabilityMetrics;
  funding: FundingDependencyMetrics;
  overallNarrative: string;
}
