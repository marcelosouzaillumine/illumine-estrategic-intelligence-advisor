import { HistoricalCycleData } from '../institutional-memory/types';

export interface InstitutionalCausalityNode {
  id: string;
  type: 'EVENT' | 'RECURRENCE' | 'METRIC_ALERT' | 'STRUCTURAL_STRAIN';
  label: string;
  cycleYear: number;
}

export type AssociationEdgeType =
  | 'TEMPORAL_PRECEDENCE'
  | 'RECURRING_ASSOCIATION'
  | 'STRUCTURAL_PROPAGATION'
  | 'FIDUCIARY_RECURRENCE'
  | 'OBSERVED_CO_OCCURRENCE';

export interface InstitutionalAssociationEdge {
  source: string;
  target: string;
  relationType: AssociationEdgeType;
  confidence: number;
}

export interface InstitutionalCausalityGraph {
  nodes: InstitutionalCausalityNode[];
  edges: InstitutionalAssociationEdge[];
}

export interface CausalSequence {
  sequenceId: string;
  steps: Array<{
    eventDescription: string;
    cycleYear: number;
  }>;
  confidence: number;
  evidenceChain: string[];
}

export type InstitutionalPropagationSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface StructuralPropagationVector {
  vectorId: string;
  sourceLayer: 'FINANCIAL' | 'OPERATIONAL' | 'EQUITY';
  targetLayer: 'FINANCIAL' | 'OPERATIONAL' | 'EQUITY';
  description: string;
  persistenceCycles: number;
  severity: InstitutionalPropagationSeverity;
}

export interface LongitudinalRiskPattern {
  patternId: string;
  description: string;
  metricAnalyzed: string;
  progressionTrend: 'DETERIORATING' | 'STABLE' | 'IMPROVING';
  observedCycles: number;
}

export interface CausalConfidenceProfile {
  temporalConfidence: number;
  structuralCoherenceConfidence: number;
  evidenceDensityConfidence: number;
  globalConfidence: number;
}

export interface GovernanceImpactChain {
  chainId: string;
  description: string;
  lineageHash: string;
  evidenceChainHash: string;
}

export interface CausalEvidenceBundle {
  cycleYears: number[];
  associatedMetrics: string[];
  auditableTraces: string[];
}

export interface TemporalCausalityWindow {
  startYear: number;
  endYear: number;
  totalCycles: number;
}

export interface InstitutionalCausalityProfile {
  graph: InstitutionalCausalityGraph;
  sequences: CausalSequence[];
  propagationVectors: StructuralPropagationVector[];
  longitudinalPatterns: LongitudinalRiskPattern[];
  confidenceProfile: CausalConfidenceProfile;
  impactChains: GovernanceImpactChain[];
  narrative: string;
  lineageHash: string;
  propagationIntegrityHash: string;
  evidenceChainHash: string;
  historicalDensityRequirement: 'INSUFFICIENT' | 'SUFFICIENT';
}

export const LOW_CONFIDENCE = 0.0;
export const MEDIUM_CONFIDENCE = 0.5;
export const HIGH_CONFIDENCE = 1.0;

export interface CycleMetrics {
  year: number;
  ativoTotal: number;
  ativoCirculante: number;
  passivoCirculante: number;
  passivoTotal: number;
  patrimonioLiquido: number;
  caixaEquivalentes: number;
  estoques: number;
  passivosFinanceiros: number;
  fornecedores: number;
  clientes: number;
  compositeScore: number;
  liqCorrente: number;
  liqImediata: number;
  netWorkingCapital: number;
}

export function extractCycleMetrics(cycle: HistoricalCycleData): CycleMetrics {
  const summary = {
    ativoTotal: 0,
    ativoCirculante: 0,
    passivoCirculante: 0,
    passivoTotal: 0,
    patrimonioLiquido: 0,
    caixaEquivalentes: 0,
    estoques: 0,
    passivosFinanceiros: 0,
    fornecedores: 0,
    clientes: 0
  };

  const bpData = cycle.bpData || [];
  if (Array.isArray(bpData)) {
    for (const entry of bpData) {
      const code = entry.code || '';
      const val = entry.value || 0;
      const accountName = (entry.accountName || '').toLowerCase();

      if (code.startsWith('1')) {
        summary.ativoTotal += val;
        if (code.startsWith('1.1')) {
          summary.ativoCirculante += val;
          const isDisponivel = [
            'caixa', 'numerário', 'numerario', 
            'banco conta movimento', 'bancos conta movimento',
            'banco conta corrente', 'bancos conta corrente',
            'banco c/c', 'bancos c/c',
            'depósitos bancários à vista', 'depósito bancário à vista',
            'depositos bancarios a vista', 'deposito bancario a vista',
            'aplicações de liquidez imediata', 'aplicacao de liquidez imediata', 'aplicacoes de liquidez imediata',
            'equivalentes de caixa', 'equivalente de caixa',
            'alta conversibilidade', 'resgate imediato'
          ].some(t => accountName.includes(t)) && !accountName.includes('restrito') && !accountName.includes('vinculado');

          if (isDisponivel) {
            summary.caixaEquivalentes += val;
          }
          if (accountName.includes('estoque') || accountName.includes('inventar') || accountName.includes('mercador')) {
            summary.estoques += val;
          }
          if (accountName.includes('cliente') || accountName.includes('contas a receber') || accountName.includes('recebive') || accountName.includes('recebível')) {
            summary.clientes += val;
          }
        }
      } else if (code.startsWith('2')) {
        summary.passivoTotal += val;
        if (code.startsWith('2.1')) {
          summary.passivoCirculante += val;
          if (accountName.includes('fornecedor') || accountName.includes('forn')) {
            summary.fornecedores += val;
          }
        }
        if (accountName.includes('financ') || accountName.includes('emprest') || accountName.includes('debent')) {
          summary.passivosFinanceiros += val;
        }
      } else if (code.startsWith('3') || code.startsWith('2.3') || accountName.includes('patrimonio') || accountName.includes('patrimônio')) {
        summary.patrimonioLiquido += val;
      }
    }
  }

  // Handle case where bpSummary pre-computed values exist in rawFinancialData or cycle itself
  // to be robust if bpData is not a list
  if (summary.ativoTotal === 0 && (cycle as any).rawFinancialData?.bpSummary) {
    const s = (cycle as any).rawFinancialData.bpSummary;
    summary.ativoTotal = s.ativoTotal || 0;
    summary.ativoCirculante = s.ativoCirculante || 0;
    summary.passivoCirculante = s.passivoCirculante || 0;
    summary.passivoTotal = s.passivoTotal || 0;
    summary.patrimonioLiquido = s.patrimonioLiquido || 0;
    summary.caixaEquivalentes = s.caixaEquivalentes || 0;
    summary.estoques = s.estoques || 0;
    summary.passivosFinanceiros = s.passivosFinanceiros || 0;
    summary.fornecedores = s.fornecedores || 0;
    summary.clientes = s.clientes || 0;
  }

  const compositeScore = cycle.scores?.composite ?? 0;
  const liqCorrente = summary.passivoCirculante > 0 ? summary.ativoCirculante / summary.passivoCirculante : 0;
  const liqImediata = summary.passivoCirculante > 0 ? summary.caixaEquivalentes / summary.passivoCirculante : 0;
  const netWorkingCapital = summary.ativoCirculante - summary.passivoCirculante;

  return {
    year: cycle.year,
    ...summary,
    compositeScore,
    liqCorrente,
    liqImediata,
    netWorkingCapital
  };
}
