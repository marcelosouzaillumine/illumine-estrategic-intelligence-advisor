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
      executiveQuestion: 'A disciplina patrimonial está adequada para garantir a normalidade estrutural?',
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

    const observation = `A dimensão de ${dimension} apresenta comportamento de ${statusLabel.toLowerCase()}.`;
    const evidence = `Indicador primário de ${selectedFrag.causalityMetric} em ${formatFact(metricValue)}.`;
    const financialMeaning = selectedFrag.rationaleSnippet.charAt(0).toUpperCase() + selectedFrag.rationaleSnippet.slice(1);
    const technicalInterpretation = `O motor analítico identificou ${selectedFrag.causalityMetric.toLowerCase()} como o ofensor crítico ou fator determinante nesta camada.`;

    return {
      dimension,
      statusLabel,
      statusBadgeVariant,
      observation,
      evidence,
      financialMeaning,
      technicalInterpretation,
      executiveQuestion: selectedFrag.executiveQuestion,
      confidence: 'Alta',
      evidences: [],
      origin: { sourceEngine: 'BalanceSheetExecutiveLanguageCompiler', sourceRule: 'Causal Analysis', confidence: 'Alta', lastValidatedAt: new Date().toISOString() }
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

    return `A organização apresenta estrutura caracterizada por ${autThreshold.label.toLowerCase()} (${autStr}) e ${liqThreshold.label.toLowerCase()} (${liqStr}), o que exige atenção proporcional à severidade de seus indicadores.`;
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

  public static compileTechnicalObservation(liqThreshold: QuantitativeThreshold, autThreshold: QuantitativeThreshold): string {
    if (liqThreshold.severity === 'CRITICAL') return 'A gravidade da liquidez requer revisão emergencial da estrutura de capital e fluxo de tesouraria.';
    if (autThreshold.severity === 'CRITICAL') return 'A dependência crítica requer avaliação estrutural do perfil do passivo e proteção patrimonial.';
    if (liqThreshold.severity === 'WARNING' || autThreshold.severity === 'WARNING') return 'A pressão em margens requer avaliação da eficiência do capital de giro.';
    return 'A estabilidade atual reforça a manutenção da disciplina na alocação de recursos.';
  }

  public static compileObservationContext(facts: BalanceSheetExecutiveFacts, liqThreshold: QuantitativeThreshold, autThreshold: QuantitativeThreshold, wcThreshold: QuantitativeThreshold) {
    // Generate observations strictly from thresholds
    let shortTerm = 'A estabilidade financeira permite o acompanhamento contínuo dos indicadores de liquidez.';
    let mediumTerm = 'A base de capital suporta contínua busca por eficiência operacional e retorno sobre ativos.';
    let longTerm = 'A estrutura de capital demonstra condições para sustentar o crescimento orgânico estrutural.';

    if (liqThreshold.severity === 'CRITICAL') {
      shortTerm = 'A criticidade da liquidez sinaliza a necessidade técnica de revisão de fluxos não essenciais.';
      mediumTerm = 'O desequilíbrio estrutural requer readequação das margens de liquidez e obrigações de ciclo imediato.';
      longTerm = 'A vulnerabilidade de caixa afeta a capacidade de absorção de estresse no horizonte futuro.';
    } else if (autThreshold.severity === 'CRITICAL') {
      shortTerm = 'A estrutura de capital indica forte pressão fiduciária e baixa retenção histórica de valor.';
      mediumTerm = 'A alta alavancagem estrutural condiciona o crescimento a novos aportes de capital externo.';
      longTerm = 'A dependência crônica de terceiros compromete a autonomia financeira estrutural.';
    } else if (liqThreshold.severity === 'WARNING' || wcThreshold.severity === 'WARNING') {
      shortTerm = 'O consumo do capital de giro exige acompanhamento próximo sobre a necessidade adicional de recursos.';
      mediumTerm = 'O ciclo de caixa em alerta afeta a conversão ótima de resultados em disponibilidade imediata.';
      longTerm = 'A disciplina de alocação de recursos torna-se variável crítica para proteger as margens futuras.';
    } else if (liqThreshold.severity === 'ROBUST' && autThreshold.severity === 'ROBUST') {
      shortTerm = 'O quadro de liquidez excedente sugere análise sobre o custo de oportunidade da ociosidade financeira.';
      mediumTerm = 'A forte retenção de valor sustenta contextos de expansão sem dependência sistêmica externa.';
      longTerm = 'A autonomia estrutural garante as condições para maximização eficiente do retorno sobre o capital investido.';
    }

    return { shortTerm, mediumTerm, longTerm };
  }
}
