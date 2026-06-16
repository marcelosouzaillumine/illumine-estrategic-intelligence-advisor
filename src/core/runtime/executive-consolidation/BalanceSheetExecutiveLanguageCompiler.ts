import { BalanceSheetExecutiveFacts } from './BalanceSheetExecutiveFactsBuilder';
import { 
  ExecutiveSemanticRegistry, 
  BPLiquidityThresholds, 
  BPAutonomyThresholds, 
  BPWorkingCapitalThresholds,
  BPDimensionalCausalFragments,
  QuantitativeThreshold,
  BPRecommendationFragment
} from './ExecutiveSemanticRegistry';

export class BalanceSheetExecutiveLanguageCompiler {
  
  public static compilePanel(
    dimension: 'Protection' | 'Liquidity' | 'CapitalStructure' | 'WorkingCapital' | 'AssetQuality' | 'CapitalEfficiency',
    facts: BalanceSheetExecutiveFacts,
    liqThreshold: QuantitativeThreshold,
    autThreshold: QuantitativeThreshold,
    wcThreshold: QuantitativeThreshold
  ) {
    const frags = BPDimensionalCausalFragments.filter(f => f.dimension === dimension && f.trigger(facts.liquidityCurrent || 0, facts.financialAutonomy || 0, facts.workingCapital || 0));
    const selectedFrag = frags[0] || {
      dimension,
      causalityMetric: 'Liquidez',
      action: 'Manter disciplina patrimonial',
      rationaleSnippet: 'os dados estruturais mantêm-se dentro da normalidade'
    };

    let metricValue = 0;
    if (selectedFrag.causalityMetric === 'Liquidez') metricValue = facts.liquidityCurrent || 0;
    else if (selectedFrag.causalityMetric === 'Autonomia') metricValue = facts.financialAutonomy || 0;
    else if (selectedFrag.causalityMetric === 'Capital de Giro') metricValue = facts.workingCapital || 0;

    const formatFact = (val: number) => val.toFixed(2);

    let statusLabel = 'Adequado';
    let statusBadgeVariant = 'success';

    if (dimension === 'Protection') {
      statusLabel = liqThreshold.severity === 'CRITICAL' ? 'Proteção Comprometida' : 'Proteção Preservada';
      statusBadgeVariant = liqThreshold.severity === 'CRITICAL' ? 'critical' : (liqThreshold.severity === 'WARNING' ? 'warning' : 'success');
    } else if (dimension === 'Liquidity') {
      statusLabel = liqThreshold.label;
      statusBadgeVariant = liqThreshold.severity === 'CRITICAL' ? 'critical' : (liqThreshold.severity === 'WARNING' ? 'warning' : 'success');
    } else if (dimension === 'CapitalStructure') {
      statusLabel = autThreshold.label;
      statusBadgeVariant = autThreshold.severity === 'CRITICAL' ? 'critical' : (autThreshold.severity === 'WARNING' ? 'warning' : 'success');
    } else if (dimension === 'WorkingCapital') {
      statusLabel = wcThreshold.label;
      statusBadgeVariant = wcThreshold.severity === 'CRITICAL' ? 'critical' : (wcThreshold.severity === 'WARNING' ? 'warning' : 'success');
    } else if (dimension === 'AssetQuality') {
      statusLabel = autThreshold.severity === 'CRITICAL' ? 'Qualidade Comprometida' : 'Qualidade Preservada';
      statusBadgeVariant = autThreshold.severity === 'CRITICAL' ? 'critical' : (autThreshold.severity === 'WARNING' ? 'warning' : 'success');
    } else if (dimension === 'CapitalEfficiency') {
      statusLabel = liqThreshold.severity === 'CRITICAL' ? 'Eficiência Suspensa' : 'Eficiência Monitorada';
      statusBadgeVariant = liqThreshold.severity === 'CRITICAL' ? 'critical' : (liqThreshold.severity === 'WARNING' ? 'warning' : 'success');
    }

    const opinion = `Indicador primário de ${selectedFrag.causalityMetric} em ${formatFact(metricValue)} demonstra que ${selectedFrag.rationaleSnippet}.`;

    return {
      dimension,
      statusLabel,
      statusBadgeVariant,
      opinion,
      driver: selectedFrag.causalityMetric,
      action: selectedFrag.action,
      score: null,
      evidences: [],
      origin: { sourceEngine: 'BalanceSheetExecutiveLanguageCompiler', sourceRule: 'Causal Execution', confidence: 'Alta', lastValidatedAt: new Date().toISOString() }
    };
  }

  public static compileDerivedScenario(liqThreshold: QuantitativeThreshold, autThreshold: QuantitativeThreshold): string {
    if (liqThreshold.severity === 'CRITICAL') return 'CRITICAL_LIQUIDITY_STRESS';
    if (liqThreshold.severity === 'WARNING' && autThreshold.severity !== 'CRITICAL') return 'RECOVERY_OR_RECOMPOSITION';
    if (liqThreshold.severity === 'HEALTHY' && autThreshold.severity === 'HEALTHY') return 'STRUCTURALLY_BALANCED';
    if (liqThreshold.severity === 'ROBUST' && autThreshold.severity === 'ROBUST') return 'EXCESS_LIQUIDITY_OPTIMIZATION';
    if (liqThreshold.severity === 'ROBUST' && autThreshold.severity !== 'CRITICAL') return 'EXPANSION_WITH_DISCIPLINE';
    
    return 'STRUCTURALLY_BALANCED'; // Default
  }

  public static compileExecutiveOpinion(facts: BalanceSheetExecutiveFacts, liqThreshold: QuantitativeThreshold, autThreshold: QuantitativeThreshold): string {
    const formatFact = (val: any, decimals = 1, isPercent = false) => {
      if (val === undefined || val === null || val === 'LIMITED_EVIDENCE') return '';
      return `${(val * (isPercent ? 100 : 1)).toFixed(decimals)}${isPercent ? '%' : 'x'}`;
    };

    const liqStr = `Liquidez em ${formatFact(facts.liquidityCurrent || 0, 2, false)}`;
    const autStr = `Autonomia de ${formatFact(facts.financialAutonomy || 0, 1, true)}`;

    return `A organização apresenta estrutura caracterizada por ${autThreshold.label.toLowerCase()} (${autStr}) e ${liqThreshold.label.toLowerCase()} (${liqStr}), exigindo ações proporcionais à severidade de seus indicadores.`;
  }

  public static compileCriticalFactor(liqThreshold: QuantitativeThreshold, autThreshold: QuantitativeThreshold): string {
    if (liqThreshold.severity === 'CRITICAL') return 'Asfixia de Liquidez Corrente';
    if (autThreshold.severity === 'CRITICAL') return 'Dependência Crítica de Terceiros';
    if (liqThreshold.severity === 'WARNING' || autThreshold.severity === 'WARNING') return 'Pressão em Margens de Segurança';
    return 'Estabilidade Estrutural';
  }

  public static compileManagementImplication(liqThreshold: QuantitativeThreshold, autThreshold: QuantitativeThreshold): string {
    if (liqThreshold.severity === 'CRITICAL') return 'Risco imediato à continuidade; exige suspensão de alocações não críticas.';
    if (autThreshold.severity === 'CRITICAL') return 'Elevado custo de capital e risco fiduciário; exige plano de desalavancagem.';
    if (liqThreshold.severity === 'WARNING' || autThreshold.severity === 'WARNING') return 'Necessidade de foco rígido na retenção de caixa e governança para evitar retrocesso.';
    return 'Necessidade de monitoramento das dimensões de risco mapeadas.';
  }

  public static compileRecommendedAction(liqThreshold: QuantitativeThreshold, autThreshold: QuantitativeThreshold): string {
    if (liqThreshold.severity === 'CRITICAL') return 'Executar plano emergencial de preservação de caixa imediatamente.';
    if (autThreshold.severity === 'CRITICAL') return 'Iniciar renegociação de dívidas e blindagem de ativos vitais.';
    if (liqThreshold.severity === 'WARNING' || autThreshold.severity === 'WARNING') return 'Acelerar conversão de capital de giro em caixa livre.';
    return 'Manter disciplina e auditar limites de alavancagem.';
  }

  public static compilePlanActions(facts: BalanceSheetExecutiveFacts, liqThreshold: QuantitativeThreshold, autThreshold: QuantitativeThreshold, wcThreshold: QuantitativeThreshold) {
    // Generate actions strictly from thresholds
    let shortTerm = 'Preservar estabilidade financeira e monitorar indicadores de liquidez.';
    let mediumTerm = 'Aprimorar eficiência operacional e retorno sobre ativos.';
    let longTerm = 'Manter estrutura de capital equilibrada e crescimento sustentável.';

    if (liqThreshold.severity === 'CRITICAL') {
      shortTerm = 'Suspender saídas não essenciais e focar em sobrevivência do caixa.';
      mediumTerm = 'Recompor liquidez mínima e alongar passivos exigíveis.';
      longTerm = 'Reconstruir margem de segurança e proteção contra estresse.';
    } else if (autThreshold.severity === 'CRITICAL') {
      shortTerm = 'Acelerar injeção de capital próprio ou retenção integral de lucro.';
      mediumTerm = 'Reduzir nível de alavancagem estrutural.';
      longTerm = 'Restabelecer níveis seguros de autonomia frente a credores.';
    } else if (liqThreshold.severity === 'WARNING' || wcThreshold.severity === 'WARNING') {
      shortTerm = 'Controlar expansão de necessidades de capital de giro.';
      mediumTerm = 'Otimizar ciclo de caixa e reduzir prazos médios.';
      longTerm = 'Garantir crescimento com disciplina em alocação de recursos.';
    } else if (liqThreshold.severity === 'ROBUST' && autThreshold.severity === 'ROBUST') {
      shortTerm = 'Avaliar custo de oportunidade de recursos ociosos.';
      mediumTerm = 'Estruturar reinvestimento produtivo ou distribuição de dividendos.';
      longTerm = 'Otimizar estrutura de capital (WACC) considerando níveis de segurança.';
    }

    return { shortTerm, mediumTerm, longTerm };
  }
}
