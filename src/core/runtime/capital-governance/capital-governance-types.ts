// src/core/runtime/capital-governance/capital-governance-types.ts

export interface CapitalRetentionMetrics {
  netIncome: number;
  retainedEarnings: number;
  retentionRatio: number;
  retentionStatus: 'ALTA_RETENÇÃO' | 'RETENÇÃO_MODERADA' | 'DISTRIBUIÇÃO_EXCESSIVA' | 'DESCAPITALIZAÇÃO' | 'NÃO_APLICÁVEL';
}

export interface ShareholderDistributionMetrics {
  totalDistributed: number;
  distributionRatio: number;
  distributionPressure: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA' | 'NÃO_APLICÁVEL';
}

export interface EquityPreservationMetrics {
  startingEquity: number;
  endingEquity: number;
  equityPreservationRatio: number; // > 1 means preserved/grown, < 1 means drained
  preservationStatus: 'PRESERVADO' | 'DRENADO' | 'NEUTRO';
}

export interface InstitutionalCapitalizationMetrics {
  capitalInjections: number;
  capitalizationRatio: number; // Ratio of new capital / total equity
  capitalizationStatus: 'ORGÂNICA' | 'INJEÇÃO_EXTERNA' | 'SEM_CAPITALIZAÇÃO';
}

export interface GovernanceCapitalBehaviorMetrics {
  capitalReinforcementIndex: number;
  governanceMaturity: 'MATURA' | 'EM_DESENVOLVIMENTO' | 'FRÁGIL' | 'DESTRUTIVA';
}

export interface CapitalGovernanceDiagnostics {
  isAvailable: boolean;
  retention: CapitalRetentionMetrics | null;
  distribution: ShareholderDistributionMetrics | null;
  preservation: EquityPreservationMetrics | null;
  capitalization: InstitutionalCapitalizationMetrics | null;
  behavior: GovernanceCapitalBehaviorMetrics | null;
}

export interface ConsolidatedCapitalGovernanceReport {
  isAvailable: boolean;
  overallNarrative: string;
  retention: any;
  distribution: any;
  preservation: any;
  capitalization: any;
  behavior: any;
}
