// src/core/runtime/capital-governance/capital-governance-types.ts
//
// DLPA Governance Curation Protocol — v2
// Ref: docs/DLPA_GOVERNANCE_CURATION_PROTOCOL.md

// ── Eixo 2: Política de Capital (Retenção) ──────────────────────────────────
export interface CapitalRetentionMetrics {
  netIncome: number;
  retainedEarnings: number;
  retentionRatio: number;
  // NÃO_APLICÁVEL_SEM_LUCRO: ausência de base distributiva — não inferir 0%
  retentionStatus:
    | 'ALTA_RETENÇÃO'
    | 'RETENÇÃO_MODERADA'
    | 'DISTRIBUIÇÃO_EXCESSIVA'
    | 'DESCAPITALIZAÇÃO_DELIBERADA'  // apenas com evidência distributiva
    | 'NÃO_APLICÁVEL_SEM_LUCRO'      // prejuízo — sem base distributiva
    | 'NÃO_APLICÁVEL'                // dados insuficientes
    | 'AUSÊNCIA_DE_CAPACIDADE_DISTRIBUTIVA'
    | 'RETENÇÃO_COMPULSÓRIA_POR_PREJUÍZO';
}

// ── Eixo 2: Política de Capital (Distribuição) ───────────────────────────────
export interface ShareholderDistributionMetrics {
  totalDistributed: number;
  distributionRatio: number;
  hasDistributiveEvidence: boolean; // flag explícita para fail-closed
  distributionPressure:
    | 'BAIXA'
    | 'MODERADA'
    | 'ALTA'
    | 'CRÍTICA'
    | 'NÃO_APLICÁVEL_SEM_LUCRO'   // sem lucro E sem distribuição
    | 'NÃO_APLICÁVEL';
}

// ── Eixo 3: Preservação Patrimonial ─────────────────────────────────────────
export interface EquityPreservationMetrics {
  startingEquity: number;
  endingEquity: number;
  equityPreservationRatio: number;
  capitalSupportRatio: number | 'NOT_AVAILABLE';
  // Classificações granulares — não colapsar em "DRENADO" sem análise
  preservationStatus:
    | 'PRESERVAÇÃO_SAUDÁVEL'   // ratio > 1.0
    | 'EROSÃO_MODERADA'        // ratio 0.85–1.0 (queda até 15%)
    | 'EROSÃO_RELEVANTE'       // ratio 0.50–0.85 (queda 15–50%)
    | 'FRAGILIDADE_PATRIMONIAL'// ratio < 0.50 (queda > 50%)
    | 'NEUTRO'                 // sem variação
    | 'DEPENDÊNCIA_DE_CAPITALIZAÇÃO'
    | 'SUSTENTAÇÃO_PATRIMONIAL_EXTERNA'
    | 'EROSÃO_PATRIMONIAL_OPERACIONAL';
}

// ── Capitalização Institucional ──────────────────────────────────────────────
export interface InstitutionalCapitalizationMetrics {
  capitalInjections: number;
  capitalizationRatio: number;
  capitalizationStatus: 'ORGÂNICA' | 'INJEÇÃO_EXTERNA' | 'SEM_CAPITALIZAÇÃO';
}

// ── Eixo 4: Governança Fiduciária ────────────────────────────────────────────
// FAIL-CLOSED: DESTRUTIVA somente com hasDistributiveEvidence = true
export interface GovernanceCapitalBehaviorMetrics {
  capitalReinforcementIndex: number;
  hasDistributiveEvidence: boolean;
  governanceMaturity:
    | 'MATURA'
    | 'EM_DESENVOLVIMENTO'
    | 'FRAGILIZADA'              // deterioração sem evidência distributiva
    | 'EM_ESTRUTURAÇÃO'          // início / sem histórico
    | 'FRÁGIL'                   // legado
    | 'DESTRUTIVA';              // SOMENTE com evidência distributiva comprovada
}

// ── Diagnóstico Consolidado ───────────────────────────────────────────────────
export interface CapitalGovernanceDiagnostics {
  isAvailable: boolean;
  retention: CapitalRetentionMetrics | null;
  distribution: ShareholderDistributionMetrics | null;
  preservation: EquityPreservationMetrics | null;
  capitalization: InstitutionalCapitalizationMetrics | null;
  behavior: GovernanceCapitalBehaviorMetrics | null;
}

// ── Relatório Consolidado ─────────────────────────────────────────────────────
export interface ConsolidatedCapitalGovernanceReport {
  isAvailable: boolean;
  overallNarrative: string;
  retention: any;
  distribution: any;
  preservation: any;
  capitalization: any;
  behavior: any;
  fiduciaryOutput?: any;
}
