import { BPSummary } from '../../lib/bpEngine';
import { FinancialMetrics } from '../../lib/financial-engine';
import { evaluateTrendConfidence, TrendConfidence } from './trend-confidence-engine';

export type TemporalMode = 'FULL_TEMPORAL_MODE' | 'LIMITED_TEMPORAL_MODE';

export type TemporalTrajectoryScore = 
  | 'Recovering' 
  | 'Stabilizing' 
  | 'Volatile' 
  | 'Deteriorating' 
  | 'Accelerating Risk' 
  | 'Turnaround Emerging' 
  | 'Structural Collapse'
  | 'Neutral';

export interface HistoricalPeriodData {
  year: number;
  bp: BPSummary;
  metrics: FinancialMetrics;
}

export interface TemporalTrajectoryOutput {
  temporalMode: TemporalMode;
  trendConfidence: TrendConfidence;
  reasonForLimitedConfidence?: string;
  historicalPeriodsAnalyzed: number;
  trajectoryImpact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  scoreAdjustment: number;
  modulationAllowedByTemporal: boolean;

  temporalScore: TemporalTrajectoryScore;
  isDestructiveGrowth: boolean;
  isTurnaroundEmerging: boolean;

  insights: {
    liquidez: string;
    estoque: string;
    margem: string;
    endividamento: string;
    capitalDeGiro: string;
    continuidade: string;
  };
}

export function evaluateTemporalCausality(
  historicalData: HistoricalPeriodData[]
): TemporalTrajectoryOutput {
  
  if (!historicalData || historicalData.length < 3) {
    const conf = evaluateTrendConfidence(historicalData ? historicalData.length : 0);
    return {
      temporalMode: 'LIMITED_TEMPORAL_MODE',
      trendConfidence: conf,
      reasonForLimitedConfidence: conf.explanation,
      historicalPeriodsAnalyzed: historicalData ? historicalData.length : 0,
      trajectoryImpact: 'NEUTRAL',
      scoreAdjustment: 0,
      modulationAllowedByTemporal: false,
      temporalScore: 'Neutral',
      isDestructiveGrowth: false,
      isTurnaroundEmerging: false,
      insights: {
        liquidez: 'Sem dados suficientes para inferência direcional.',
        estoque: 'Sem dados suficientes para inferência direcional.',
        margem: 'Sem dados suficientes para inferência direcional.',
        endividamento: 'Sem dados suficientes para inferência direcional.',
        capitalDeGiro: 'Sem dados suficientes para inferência direcional.',
        continuidade: 'Série histórica incompleta para detecção de tendência.'
      }
    };
  }

  // Ordena os dados (mais antigo para o mais recente)
  const sorted = [...historicalData].sort((a, b) => a.year - b.year);
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];

  const conf = evaluateTrendConfidence(sorted.length);

  // Variações e Deltas (entre oldest e newest)
  const deltaEbitda = newest.metrics.ebitda - oldest.metrics.ebitda;
  const deltaCaixa = newest.metrics.saldoTesouraria - oldest.metrics.saldoTesouraria;
  const deltaDivida = newest.bp.passivosFinanceiros - oldest.bp.passivosFinanceiros;
  const deltaEstoque = newest.bp.estoques - oldest.bp.estoques;
  // Receita aproximada pelo giro ou EBITDA se não houver DRE completa com Receita (vamos usar proxy de variação de AC / ativo)
  // Como `revenue` não está mapeada nativamente no bpSummary, usamos a margem / EBITDA / estoques.
  // Se estoque cresceu 50% e Ebitda caiu, isso é ineficiência severa.
  const estoqueCresceu = deltaEstoque > oldest.bp.estoques * 0.1;

  let isDestructiveGrowth = false;
  let isTurnaroundEmerging = false;
  let trajectoryImpact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = 'NEUTRAL';
  let scoreAdjustment = 0;
  let temporalScore: TemporalTrajectoryScore = 'Stabilizing';

  // DETECÇÃO DE DESTRUCTIVE GROWTH
  // "Receita crescendo sem caixa, estoque crescendo acima da demanda, dívida crescendo acima da geração, EBITDA deteriorando"
  if (estoqueCresceu && deltaEbitda < 0 && deltaCaixa < 0 && deltaDivida > oldest.bp.passivosFinanceiros * 0.1) {
    isDestructiveGrowth = true;
    temporalScore = 'Structural Collapse';
    trajectoryImpact = 'NEGATIVE';
    scoreAdjustment = -20;
  }

  // DETECÇÃO DE TURNAROUND
  // "desaceleração do prejuízo, recomposição de margem, melhora de caixa"
  if (oldest.metrics.lucroLiquido < 0 && newest.metrics.lucroLiquido > oldest.metrics.lucroLiquido && deltaCaixa > 0 && newest.metrics.ebitda > previous.metrics.ebitda) {
    isTurnaroundEmerging = true;
    temporalScore = 'Turnaround Emerging';
    trajectoryImpact = 'POSITIVE';
    scoreAdjustment = +15;
  }

  // DETECÇÃO GERAL SE NÃO BATEU PADRÕES EXTREMOS
  if (!isDestructiveGrowth && !isTurnaroundEmerging) {
    if (deltaEbitda > 0 && deltaCaixa > 0) {
      temporalScore = 'Recovering';
      trajectoryImpact = 'POSITIVE';
      scoreAdjustment = +10;
    } else if (deltaEbitda < 0 && deltaCaixa < 0) {
      temporalScore = 'Deteriorating';
      trajectoryImpact = 'NEGATIVE';
      scoreAdjustment = -10;
    } else {
      temporalScore = 'Volatile';
      trajectoryImpact = 'NEUTRAL';
      scoreAdjustment = 0;
    }
  }

  // Aceleração de Risco
  if (temporalScore === 'Deteriorating' && newest.bp.patrimonioLiquido < previous.bp.patrimonioLiquido && previous.bp.patrimonioLiquido < oldest.bp.patrimonioLiquido) {
    temporalScore = 'Accelerating Risk';
    scoreAdjustment = -15;
  }

  // Insights Longitudinais
  const insights = {
    liquidez: deltaCaixa > 0 ? "Trajetória indica recomposição gradual da capacidade de caixa." : "Trajetória aponta consumo progressivo de tesouraria operacional.",
    estoque: estoqueCresceu ? (isDestructiveGrowth ? "Sobreacumulação severa com perda de tração e consumo destrutivo de capital." : "Expansão de base operacional.") : "Níveis de inventário sob controle estrutural ou contração de base.",
    margem: deltaEbitda > 0 ? "Recomposição progressiva da capacidade de geração operacional." : "Deterioração silenciosa do core business (destruição de EBITDA).",
    endividamento: deltaDivida > 0 ? (deltaEbitda > 0 ? "Crescimento alavancado compensado por geração de caixa." : "Aumento recorrente de dependência de capital de terceiros oneroso.") : "Desalavancagem ativa.",
    capitalDeGiro: newest.metrics.ncg > oldest.metrics.ncg ? "Necessidade de caixa esticando as linhas operacionais progressivamente." : "Melhora estrutural do ciclo financeiro.",
    continuidade: isDestructiveGrowth ? "Padrão de expansão destrutiva identificado; colapso sistêmico em aceleração." : (isTurnaroundEmerging ? "Sinais consistentes de turnaround financeiro e estancamento de sangria." : "Base mantendo estabilidade tática.")
  };

  return {
    temporalMode: 'FULL_TEMPORAL_MODE',
    trendConfidence: conf,
    historicalPeriodsAnalyzed: sorted.length,
    trajectoryImpact,
    scoreAdjustment,
    modulationAllowedByTemporal: !isDestructiveGrowth,
    temporalScore,
    isDestructiveGrowth,
    isTurnaroundEmerging,
    insights
  };
}
