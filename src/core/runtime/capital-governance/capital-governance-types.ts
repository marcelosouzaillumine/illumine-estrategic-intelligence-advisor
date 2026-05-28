export interface CapitalRetentionMetrics {
  retainedEarnings: number;
  netIncome: number;
  retentionRate: number | null; // retainedEarnings / netIncome
  retentionEfficiency: 'ALTA' | 'MODERADA' | 'INSUFICIENTE' | 'CRÍTICA' | 'FALTA_DADO';
  reserveReinforcement: number;
  narrative: string;
}

export interface ShareholderDistributionMetrics {
  distributedDividends: number;
  payoutRatio: number | null; // distributedDividends / netIncome
  distributionDiscipline: 'DISCIPLINADA' | 'AGRESSIVA' | 'DRENAGEM' | 'SAUDÁVEL' | 'FALTA_DADO';
  corporateDrainRatio: number | null; // dividends / equity or dividends / cash
  narrative: string;
}

export interface EquityPreservationMetrics {
  equityChange: number;
  replenishmentIndex: number | null; // equityChange / netIncome (if positive, otherwise measures erosion)
  equityErosionDetected: boolean;
  preservationStatus: 'PRESERVADO' | 'ESTÁVEL' | 'EROSÃO_PARCIAL' | 'EROSÃO_SEVERA' | 'FALTA_DADO';
  narrative: string;
}

export interface GovernanceCapitalBehaviorMetrics {
  shareholderLoansVolume: number; // mútuos de sócios
  capitalDisciplineRating: 'FORTE' | 'SENSÍVEL' | 'DISPLICENTE' | 'CRÍTICA' | 'FALTA_DADO';
  isShareholderDrainingCompany: boolean;
  loansToNetIncomeRatio: number | null;
  narrative: string;
}

export interface InstitutionalCapitalizationMetrics {
  capitalSocial: number;
  lucrosRetidosAcumulados: number;
  capitalizationIndex: number | null; // (Capital Social + Reservas) / Ativo Total
  maturityRating: 'MADURA' | 'EM_DESENVOLVIMENTO' | 'FRÁGIL' | 'FALTA_DADO';
  narrative: string;
}

export interface ConsolidatedCapitalGovernanceReport {
  isAvailable: boolean;
  retention: CapitalRetentionMetrics;
  distribution: ShareholderDistributionMetrics;
  preservation: EquityPreservationMetrics;
  behavior: GovernanceCapitalBehaviorMetrics;
  capitalization: InstitutionalCapitalizationMetrics;
  overallNarrative: string;
}
