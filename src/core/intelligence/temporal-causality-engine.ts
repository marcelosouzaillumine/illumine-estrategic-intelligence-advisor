import { BPSummary } from '../../lib/bpEngine';
type FinancialMetrics = any;
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

export type TemporalTrendDirection = 'ACCELERATING' | 'DECELERATING' | 'STABLE' | 'VOLATILE';
export type TemporalConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export enum TemporalPatternName {
  PROGRESSIVE_DETERIORATION = 'PROGRESSIVE_DETERIORATION',
  ABRUPT_COLLAPSE = 'ABRUPT_COLLAPSE',
  RECURRENT_EXTERNAL_DEPENDENCY = 'RECURRENT_EXTERNAL_DEPENDENCY',
  ARTIFICIAL_IMPROVEMENT = 'ARTIFICIAL_IMPROVEMENT',
  STRUCTURAL_RECOVERY = 'STRUCTURAL_RECOVERY',
  STABILIZATION = 'STABILIZATION',
  DESTRUCTIVE_GROWTH = 'DESTRUCTIVE_GROWTH'
}

import { ExecutiveEmptyStateResolver } from "../runtime/integrity/ExecutiveEmptyStateResolver";
export type TrendSignal = {
  indicator: string;
  direction: TemporalTrendDirection;
  cagr?: number;
  isFavorable: boolean;
  description: string;
};

export interface TemporalTrendSignal {
  indicator: string;
  direction: TemporalTrendDirection;
  cagr?: number;
  isFavorable: boolean;
  description: string;
}

export interface TemporalInflectionPoint {
  period: string;
  indicator: string;
  type: 'REVERSAL_TO_POSITIVE' | 'REVERSAL_TO_NEGATIVE' | 'STABILIZATION';
  description: string;
}

export interface TemporalRiskPattern {
  patternId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  name: TemporalPatternName;
  label: string;
  evidence: string[];
}

export interface TemporalRecoveryPattern {
  patternId: string;
  strength: 'STRONG' | 'MODERATE' | 'WEAK';
  name: TemporalPatternName;
  label: string;
  evidence: string[];
}

export interface TemporalCausalityOutput extends TemporalTrajectoryOutput {
  trendSignals: TemporalTrendSignal[];
  inflectionPoints: TemporalInflectionPoint[];
  riskPatterns: TemporalRiskPattern[];
  recoveryPatterns: TemporalRecoveryPattern[];
  executiveSummary: string;
  confidence: TemporalConfidence;
}

export function evaluateTemporalCausality(
  historicalData: HistoricalPeriodData[]
): TemporalCausalityOutput {
  const tStart = performance.now();
  
  if (!historicalData || historicalData.length < 3) {
    const conf = evaluateTrendConfidence(historicalData ? historicalData.length : 0);
    console.log(`[TELEMETRY] Temporal Engine Execution Time: ${(performance.now() - tStart).toFixed(2)}ms (LIMITED RUN)`);
    const isAbruptCollapse = historicalData.length === 2 && 
                             ((historicalData[1].metrics.saldoTesouraria < historicalData[0].metrics.saldoTesouraria * 0.2 && historicalData[0].metrics.saldoTesouraria > 0) || 
                              (historicalData[1].bp.patrimonioLiquido < historicalData[0].bp.patrimonioLiquido * 0.5 && historicalData[0].bp.patrimonioLiquido > 0));
    
    if (isAbruptCollapse) {
      return {
        temporalMode: 'LIMITED_TEMPORAL_MODE',
        trendConfidence: conf,
        reasonForLimitedConfidence: conf.explanation,
        historicalPeriodsAnalyzed: 2,
        trajectoryImpact: 'NEGATIVE',
        scoreAdjustment: -20,
        modulationAllowedByTemporal: false,
        temporalScore: 'Structural Collapse',
        isDestructiveGrowth: false,
        isTurnaroundEmerging: false,
        insights: {
          liquidez: 'Alerta: Queda severa de caixa.',
          estoque: 'Sem dados.',
          margem: 'Sem dados.',
          endividamento: 'Sem dados.',
          capitalDeGiro: 'Sem dados.',
          continuidade: 'Sinais de ruptura iminente.'
        },
        trendSignals: [],
        inflectionPoints: [],
        riskPatterns: [{
          patternId: 'RISK_ABRUPT_COLLAPSE',
          severity: 'CRITICAL',
          name: TemporalPatternName.ABRUPT_COLLAPSE,
          label: 'Colapso Abrupto',
          evidence: ['Destruição severa de liquidez ou patrimônio em ciclo único', 'Sinais de ruptura iminente']
        }],
        recoveryPatterns: [],
        executiveSummary: 'Alerta máximo: Colapso abrupto identificado nos níveis de liquidez ou proteção patrimonial.',
        confidence: 'LOW'
      };
    }

    if (!historicalData || historicalData.length < 2) {
      return {
        temporalMode: 'LIMITED_TEMPORAL_MODE',
        trendConfidence: conf,
        reasonForLimitedConfidence: 'Apenas um exercício disponível',
        historicalPeriodsAnalyzed: historicalData ? historicalData.length : 0,
        trajectoryImpact: 'NEUTRAL',
        scoreAdjustment: 0,
        modulationAllowedByTemporal: false,
        temporalScore: 'Neutral',
        isDestructiveGrowth: false,
        isTurnaroundEmerging: false,
        insights: {
          liquidez: ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY,
          estoque: ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY,
          margem: ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY,
          endividamento: ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY,
          capitalDeGiro: ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY,
          continuidade: ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY
        },
        trendSignals: [],
        inflectionPoints: [],
        riskPatterns: [],
        recoveryPatterns: [],
        executiveSummary: ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY,
        confidence: 'LOW'
      };
    }

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
        liquidez: 'Série curta. Sinais limitados de tendência.',
        estoque: 'Série curta. Sinais limitados de tendência.',
        margem: 'Série curta. Sinais limitados de tendência.',
        endividamento: 'Série curta. Sinais limitados de tendência.',
        capitalDeGiro: 'Série curta. Sinais limitados de tendência.',
        continuidade: 'Série histórica incompleta para detecção de tendência longa.'
      },
      trendSignals: [],
      inflectionPoints: [],
      riskPatterns: [],
      recoveryPatterns: [],
      executiveSummary: 'Série histórica insuficiente para estabelecer correlação longitudinal com precisão máxima. Análise restrita a dois ciclos.',
      confidence: 'LOW'
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

  const trendSignals: TemporalTrendSignal[] = [];
  const inflectionPoints: TemporalInflectionPoint[] = [];
  const riskPatterns: TemporalRiskPattern[] = [];
  const recoveryPatterns: TemporalRecoveryPattern[] = [];

  let confidence: TemporalConfidence = 'MEDIUM';
  if (sorted.length >= 5) confidence = 'HIGH';

  let executiveSummary = 'Padrão temporal estabilizado com flutuações operacionais normais.';

  // DETECÇÃO DE ABRUPT COLLAPSE (Queda severa de caixa/PL em 1 período)
  const isAbruptCollapse = (newest.metrics.saldoTesouraria < previous.metrics.saldoTesouraria * 0.2 && previous.metrics.saldoTesouraria > 0) || 
                           (newest.bp.patrimonioLiquido < previous.bp.patrimonioLiquido * 0.5 && previous.bp.patrimonioLiquido > 0);

  // DETECÇÃO DE PROGRESSIVE DETERIORATION (Queda consecutiva de EBITDA + Aumento de dívida)
  const isProgressiveDeterioration = newest.metrics.ebitda < previous.metrics.ebitda && 
                                     previous.metrics.ebitda < oldest.metrics.ebitda && 
                                     newest.bp.passivosFinanceiros > previous.bp.passivosFinanceiros &&
                                     previous.bp.passivosFinanceiros > oldest.bp.passivosFinanceiros;

  // DETECÇÃO DE RECURRENT EXTERNAL DEPENDENCY (Queima de caixa operacional coberta por dívida)
  const isRecurrentDependency = newest.metrics.ebitda <= 0 && previous.metrics.ebitda <= 0 && deltaDivida > 0 && deltaCaixa >= 0;

  // DETECÇÃO DE ARTIFICIAL IMPROVEMENT (Lucro Líquido subindo, mas EBITDA caindo e sem melhora real no caixa orgânico)
  const isArtificialImprovement = newest.metrics.lucroLiquido > previous.metrics.lucroLiquido && 
                                  newest.metrics.ebitda < previous.metrics.ebitda;

  if (isDestructiveGrowth) {
    riskPatterns.push({
      patternId: 'RISK_DESTRUCTIVE_GROWTH',
      severity: 'CRITICAL',
      name: TemporalPatternName.DESTRUCTIVE_GROWTH,
      label: 'Crescimento Destrutivo',
      evidence: [
        'Aumento de estoque desproporcional',
        'Consumo contínuo de caixa',
        'Crescimento de dívida',
        'Deterioração de margem operacional (EBITDA)'
      ]
    });
  } 
  
  if (isAbruptCollapse) {
    riskPatterns.push({
      patternId: 'RISK_ABRUPT_COLLAPSE',
      severity: 'CRITICAL',
      name: TemporalPatternName.ABRUPT_COLLAPSE,
      label: 'Colapso Abrupto',
      evidence: [
        'Destruição severa de liquidez ou patrimônio em ciclo único',
        'Sinais de ruptura iminente'
      ]
    });
  } 
  
  if (isProgressiveDeterioration) {
    riskPatterns.push({
      patternId: 'RISK_PROGRESSIVE_DETERIORATION',
      severity: 'HIGH',
      name: TemporalPatternName.PROGRESSIVE_DETERIORATION,
      label: 'Deterioração Progressiva',
      evidence: [
        'Queda consecutiva de geração operacional',
        'Aumento sistêmico de endividamento'
      ]
    });
  } 
  
  if (isArtificialImprovement) {
    riskPatterns.push({
      patternId: 'RISK_ARTIFICIAL_IMPROVEMENT',
      severity: 'HIGH',
      name: TemporalPatternName.ARTIFICIAL_IMPROVEMENT,
      label: 'Melhora Artificial',
      evidence: [
        'Aumento de lucro líquido incompatível com geração de caixa e EBITDA',
        'Sinais de efeitos não-recorrentes mascarando queima operacional'
      ]
    });
  } 
  
  if (isRecurrentDependency) {
    riskPatterns.push({
      patternId: 'RISK_RECURRENT_DEPENDENCY',
      severity: 'MEDIUM',
      name: TemporalPatternName.RECURRENT_EXTERNAL_DEPENDENCY,
      label: 'Dependência de Capital Externo',
      evidence: [
        'Geração de caixa nula ou negativa persistente',
        'Manutenção de liquidez suportada primariamente por assunção de dívidas'
      ]
    });
  }

  if (isDestructiveGrowth || isAbruptCollapse || isProgressiveDeterioration || isArtificialImprovement || isRecurrentDependency) {
    executiveSummary = 'Identificados padrões de risco na trajetória financeira. Atenção à estruturação operacional.';
    if (isDestructiveGrowth) executiveSummary = 'Identificado padrão crítico de expansão destrutiva, caracterizado por queima progressiva de tesouraria operacional simultânea à alavancagem externa.';
    else if (isAbruptCollapse) executiveSummary = 'Alerta máximo: Colapso abrupto identificado nos níveis de liquidez ou proteção patrimonial.';
    else if (isProgressiveDeterioration) executiveSummary = 'Padrão de deterioração contínua. A empresa está perdendo capacidade de geração enquanto amplia exposição a dívidas.';
    else if (isArtificialImprovement) executiveSummary = 'Melhora contábil artificial detectada. O resultado de última linha foi impulsionado por fatores não operacionais, mascarando a degradação do core business.';
    else if (isRecurrentDependency) executiveSummary = 'Operação artificialmente mantida. A capacidade de tesouraria decorre de influxo constante de dívida, sem sustentação na geração própria.';
  } else if (isTurnaroundEmerging) {
    recoveryPatterns.push({
      patternId: 'REC_TURNAROUND_EMERGING',
      strength: 'MODERATE',
      name: TemporalPatternName.STRUCTURAL_RECOVERY,
      label: 'Turnaround Emergente',
      evidence: [
        'Reversão de histórico de prejuízo',
        'Recuperação de caixa operacional',
        'Expansão de margem EBITDA consolidada'
      ]
    });
    executiveSummary = 'Sinais consistentes de recuperação estrutural emergente, com estancamento de perdas e formação de nova capacidade de geração.';
  } else if (deltaEbitda > 0 && deltaCaixa > 0 && deltaDivida <= 0) {
    recoveryPatterns.push({
      patternId: 'REC_STABILIZATION',
      strength: 'MODERATE',
      name: TemporalPatternName.STABILIZATION,
      label: 'Estabilização de Fundamentos',
      evidence: [
        'Geração operacional consistente',
        'Ausência de pressão de dívida adicional'
      ]
    });
    executiveSummary = 'Fase de estabilização confirmada. Fundamentos operacionais sólidos sustentando fluxo orgânico.';
  }

  // TREND SIGNALS
  trendSignals.push({
    indicator: 'EBITDA',
    direction: deltaEbitda > 0 ? (newest.metrics.ebitda - previous.metrics.ebitda > previous.metrics.ebitda - oldest.metrics.ebitda ? 'ACCELERATING' : 'DECELERATING') : 'DECELERATING',
    isFavorable: deltaEbitda > 0,
    description: `A geração operacional histórica apresenta ${deltaEbitda > 0 ? 'ganho' : 'perda'} de tração.`
  });

  trendSignals.push({
    indicator: 'Tesouraria (Caixa)',
    direction: deltaCaixa > 0 ? 'ACCELERATING' : 'DECELERATING',
    isFavorable: deltaCaixa > 0,
    description: `A liquidez consolidada indica ${deltaCaixa > 0 ? 'acúmulo' : 'consumo'} progressivo de caixa.`
  });

  // INFLECTION POINTS
  if (previous.metrics.ebitda < 0 && newest.metrics.ebitda > 0) {
    inflectionPoints.push({
      period: newest.year.toString(),
      indicator: 'EBITDA',
      type: 'REVERSAL_TO_POSITIVE',
      description: 'Retomada de geração operacional positiva após período de queima.'
    });
  }
  if (previous.metrics.lucroLiquido < 0 && newest.metrics.lucroLiquido > 0) {
    inflectionPoints.push({
      period: newest.year.toString(),
      indicator: 'Lucro Líquido',
      type: 'REVERSAL_TO_POSITIVE',
      description: 'Break-even financeiro atingido no último período.'
    });
  }

  console.log(`[TELEMETRY] Temporal Engine Execution Time: ${(performance.now() - tStart).toFixed(2)}ms (FULL RUN, ${sorted.length} years)`);

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
    insights,
    trendSignals,
    inflectionPoints,
    riskPatterns,
    recoveryPatterns,
    executiveSummary,
    confidence
  };
}
