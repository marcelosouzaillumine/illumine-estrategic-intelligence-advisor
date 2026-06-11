import * as ExecutiveSemanticBoundaryGuard from './ExecutiveSemanticBoundaryGuard';

export type AnalyticalModule = 'BP' | 'DRE' | 'DFC' | 'DLPA' | 'EFOS' | 'ESGIM' | 'WORKSPACE' | 'BOARD_INT';

export type StrategicSeverityLevel = 'CRITICAL' | 'WARNING' | 'HEALTHY';

export interface ExecutiveAnalysisContext {
  moduleContext: AnalyticalModule;
  activeFiduciaryRestrictions: string[];
  fiduciaryClassification: string;
  mathematicalClassification: string;
  globalScore: number;
  primaryIndicators: {
    liquidityScore?: number;
    solvencyScore?: number;
    profitabilityScore?: number;
    autonomyScore?: number;
    [key: string]: any;
  };
  technicalDrivers?: {
    [key: string]: number | string | boolean | null | undefined;
  };
  contextualAlerts: string[];
}

export interface StrategicOpinion {
  situacaoAtual: string;
  prioridadeEstrategica: string;
  outlook: string;
  fullNarrative: string;
  severityState: StrategicSeverityLevel;
}

export class StrategicOpinionConsistencyEngine {
  
  /**
   * Derives the semantic severity state based on strict institutional precedence:
   * 1. Fiduciary Restrictions
   * 2. Fiduciary Classification
   * 3. Mathematical Classification / Score
   */
  private static determineSeverityState(context: ExecutiveAnalysisContext): StrategicSeverityLevel {
    // 1. Critical Fiduciary Restrictions active
    if (context.activeFiduciaryRestrictions && context.activeFiduciaryRestrictions.length > 0) {
      return 'CRITICAL';
    }

    // 2. Fiduciary Classification (Strongest Narrative Driver)
    const fidClass = (context.fiduciaryClassification || '').toUpperCase();
    if (fidClass.includes('CRÍTIC') || fidClass.includes('CRITIC') || fidClass.includes('COLAPSO')) return 'CRITICAL';
    if (fidClass.includes('ATENÇÃO') || fidClass.includes('WARNING') || fidClass.includes('MONITORAMENTO')) return 'WARNING';
    if (fidClass.includes('SAUDÁVEL') || fidClass.includes('RESILIENT') || fidClass.includes('ROBUSTO')) return 'HEALTHY';

    // 3. Mathematical Classification
    const mathClass = (context.mathematicalClassification || '').toUpperCase();
    if (mathClass.includes('CRÍTIC') || mathClass.includes('FRAGILE')) return 'CRITICAL';
    if (mathClass.includes('VULNERABLE') || mathClass.includes('ATTENTION')) return 'WARNING';
    if (mathClass.includes('RESILIENT') || mathClass.includes('STABLE')) return 'HEALTHY';

    // 4. Fallback based on global score
    if (context.globalScore >= 70) return 'HEALTHY';
    if (context.globalScore >= 40) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Synthesizes the core opinion components preventing hallucinations or contradictions.
   */
  private static synthesizeComponents(context: ExecutiveAnalysisContext, severity: StrategicSeverityLevel) {
    let situacaoAtual = '';
    let prioridadeEstrategica = '';
    let outlook = '';

    const isPatrimonial = context.moduleContext === 'BP' || context.moduleContext === 'EFOS';
    const isPerformance = context.moduleContext === 'DRE' || context.moduleContext === 'DFC' || context.moduleContext === 'EFOS';

    switch (severity) {
      case 'CRITICAL':
        situacaoAtual = isPatrimonial 
          ? 'A estrutura patrimonial encontra-se sob stress severo, exigindo ações imediatas de proteção de capital e estabilização de liquidez.'
          : 'A operação apresenta vulnerabilidades críticas, operando com restrições materiais que comprometem o equilíbrio de curto prazo.';
        prioridadeEstrategica = 'Recomposição urgente de liquidez, contenção de expansão, alongamento de passivos e estancamento de consumo de capital.';
        outlook = 'O cenário exige foco total em sobrevivência e gestão emergencial de caixa até a normalização dos indicadores vitais.';
        break;

      case 'WARNING':
        situacaoAtual = isPatrimonial
          ? 'A estrutura patrimonial é funcional, porém apresenta pontos de atenção que exigem monitoramento ativo para evitar deterioração.'
          : 'O modelo de operação apresenta viabilidade, mas com margens sob pressão e necessidade de ganho de eficiência.';
        prioridadeEstrategica = 'Prudência na alocação de recursos, otimização de capital de giro, redução de concentração de riscos e disciplina de execução.';
        outlook = 'Cenário estável no curto prazo, exigindo monitoramento contínuo para transição a um estado de maior resiliência estrutural.';
        break;

      case 'HEALTHY':
        situacaoAtual = isPatrimonial
          ? 'A estrutura patrimonial apresenta elevada solvência, liquidez confortável e robusta autonomia financeira, sem restrições materiais ativas.'
          : 'A operação demonstra forte capacidade de geração de valor, com indicadores consistentes de rentabilidade e conversão em caixa.';
        prioridadeEstrategica = 'Otimização da estrutura de capital, alocação eficiente de excedentes, política de reservas e expansão sustentável com disciplina.';
        outlook = 'O cenário atual oferece fundamentos robustos para sustentar planos de crescimento e iniciativas estratégicas não-orgânicas.';
        break;
    }

    return { situacaoAtual, prioridadeEstrategica, outlook };
  }

  /**
   * Generates the final Strategic Opinion using the unified framework
   */
  public static deriveStrategicOpinion(context: ExecutiveAnalysisContext): StrategicOpinion {
    const severityState = this.determineSeverityState(context);
    const { situacaoAtual, prioridadeEstrategica, outlook } = this.synthesizeComponents(context, severityState);

    const rawNarrative = `Situação Atual: ${situacaoAtual} Prioridade Estratégica: ${prioridadeEstrategica} Outlook: ${outlook}`;
    
    // Pass everything through the semantic guardrail to enforce vocabulary coherence
    const safeSituacao = ExecutiveSemanticBoundaryGuard.sanitize(situacaoAtual, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safePrioridade = ExecutiveSemanticBoundaryGuard.sanitize(prioridadeEstrategica, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safeOutlook = ExecutiveSemanticBoundaryGuard.sanitize(outlook, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safeFullNarrative = ExecutiveSemanticBoundaryGuard.sanitize(rawNarrative, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');

    return {
      situacaoAtual: safeSituacao,
      prioridadeEstrategica: safePrioridade,
      outlook: safeOutlook,
      fullNarrative: safeFullNarrative,
      severityState
    };
  }
}
