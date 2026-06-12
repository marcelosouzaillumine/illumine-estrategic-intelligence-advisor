import * as ExecutiveSemanticBoundaryGuard from './ExecutiveSemanticBoundaryGuard';
import { qualifyLiquidity, qualifyLeverage, qualifyAutonomy, qualifyCapitalDependency } from './ExecutiveDriverQualifiers';

export type AnalyticalModule = 'BP' | 'DRE' | 'DFC' | 'DLPA' | 'EFOS' | 'ESGIM' | 'WORKSPACE' | 'BOARD_INT';

export type StrategicSeverityLevel = 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'NEUTRAL';

export interface ExecutiveAnalysisContext {
  analysisYear: number;
  generatedAt: string;
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
  isComplete?: boolean;
}

export class StrategicOpinionConsistencyEngine {
  
  private static checkDriverCompleteness(context: ExecutiveAnalysisContext): boolean {
    const d = context.technicalDrivers || {};
    const check = (keys: string[]) => keys.every(k => d[k] !== undefined && d[k] !== null);

    switch (context.moduleContext) {
      case 'BP':
        return check(['liquidezReal', 'liquidezSeca', 'liquidezInstantaneaReal', 'endividamentoGeral', 'autonomiaFinanceira', 'patrimonioLiquido']);
      case 'DRE':
        return check(['receitaLiquida', 'margemLiquida', 'ebitda', 'coberturaPontoEquilibrio', 'resultadoLiquido']);
      case 'DFC':
        return check(['fco', 'saldoTesouraria', 'runway', 'dependenciaSocios', 'conversaoReceitaCaixa']);
      case 'DLPA':
        return check(['lucroPrejuizoPeriodo', 'lucrosPrejuizosAcumulados', 'capitalSocial', 'patrimonioLiquido', 'capacidadeDistribuicao']);
      default:
        return true;
    }
  }

  /**
   * Derives the semantic severity state based on strict institutional precedence:
   * 1. Fiduciary Restrictions
   * 2. Hard Triggers (Severity Lock)
   * 3. Fiduciary Classification
   * 4. Mathematical Classification / Score
   */
  private static determineSeverityState(context: ExecutiveAnalysisContext): StrategicSeverityLevel {
    // 0. Completeness Guard
    if (!this.checkDriverCompleteness(context)) {
      return 'NEUTRAL';
    }

    // 1. Critical Fiduciary Restrictions active
    if (context.activeFiduciaryRestrictions && context.activeFiduciaryRestrictions.length > 0) {
      return 'CRITICAL';
    }

    // 2. Hard Triggers (Severity Lock)
    const d = context.technicalDrivers || {};
    const lqReal = Number(d.liquidezReal);
    const lqSeca = Number(d.liquidezSeca);
    const lqInst = Number(d.liquidezInstantaneaReal);
    const saldoTes = Number(d.saldoTesouraria);
    const margem = Number(d.margemLiquida);
    const fco = Number(d.fco);
    const pl = Number(d.patrimonioLiquido);

    if (
      (!isNaN(lqReal) && lqReal < 1.0) ||
      (!isNaN(lqSeca) && lqSeca < 1.0) ||
      (!isNaN(lqInst) && lqInst < 0.5) ||
      (!isNaN(saldoTes) && saldoTes < 0) ||
      (!isNaN(margem) && margem < -0.1) || // relevant negative margin
      (!isNaN(fco) && fco < 0) ||
      (!isNaN(pl) && pl < 0)
    ) {
      return 'CRITICAL';
    }

    // 3. Fiduciary Classification (Strongest Narrative Driver)
    const fidClass = (context.fiduciaryClassification || '').toUpperCase();
    if (fidClass.includes('CRÍTIC') || fidClass.includes('CRITIC') || fidClass.includes('COLAPSO')) return 'CRITICAL';
    if (fidClass.includes('ATENÇÃO') || fidClass.includes('WARNING') || fidClass.includes('MONITORAMENTO')) return 'WARNING';
    if (fidClass.includes('SAUDÁVEL') || fidClass.includes('RESILIENT') || fidClass.includes('ROBUSTO')) return 'HEALTHY';

    // 4. Mathematical Classification
    const mathClass = (context.mathematicalClassification || '').toUpperCase();
    if (mathClass.includes('CRÍTIC') || mathClass.includes('FRAGILE')) return 'CRITICAL';
    if (mathClass.includes('VULNERABLE') || mathClass.includes('ATTENTION')) return 'WARNING';
    if (mathClass.includes('RESILIENT') || mathClass.includes('STABLE')) return 'HEALTHY';

    // 5. Fallback based on global score
    if (context.globalScore >= 70) return 'HEALTHY';
    if (context.globalScore >= 40) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Synthesizes the core opinion components preventing hallucinations or contradictions.
   */
  private static synthesizeComponents(context: ExecutiveAnalysisContext, severity: StrategicSeverityLevel) {
    if (severity === 'NEUTRAL') {
      return {
        situacaoAtual: 'Dados insuficientes para diagnóstico fiduciário completo. Requer mapeamento detalhado dos drivers vitais.',
        prioridadeEstrategica: 'Normalização da base de dados e consolidação das demonstrações financeiras.',
        outlook: 'Aguardando informações materiais para projeção estratégica confiável.'
      };
    }

    let situacaoAtual = '';
    let prioridadeEstrategica = '';
    let outlook = '';

    const isPatrimonial = context.moduleContext === 'BP' || context.moduleContext === 'EFOS';
    const isPerformance = context.moduleContext === 'DRE' || context.moduleContext === 'DFC' || context.moduleContext === 'EFOS';

    const d = context.technicalDrivers || {};

    // For BP context
    const liquidezReal = Number(d.liquidezReal);
    const endividamentoGeral = Number(d.endividamentoGeral);
    const autonomiaFinanceira = Number(d.autonomiaFinanceira);
    const dependenciaCapital = Number(d.dependenciaCapitalTerceiros);

    const qLiquidez = qualifyLiquidity(isNaN(liquidezReal) ? undefined : liquidezReal);
    const qAlavancagem = qualifyLeverage(isNaN(endividamentoGeral) ? undefined : endividamentoGeral);
    const qAutonomia = qualifyAutonomy(isNaN(autonomiaFinanceira) ? undefined : autonomiaFinanceira);
    const qDependencia = qualifyCapitalDependency(isNaN(dependenciaCapital) ? undefined : dependenciaCapital);

    // For DRE context
    const margemLiquida = Number(d.margemLiquida);
    const ebitda = Number(d.ebitda);
    
    // For DFC context
    const fco = Number(d.fco);

    switch (severity) {
      case 'CRITICAL':
        situacaoAtual = isPatrimonial 
          ? `A estrutura patrimonial encontra-se sob stress severo, refletindo ${qLiquidez} e ${qAutonomia}, exigindo ações imediatas de proteção de capital.`
          : 'A operação apresenta vulnerabilidades críticas, operando com restrições materiais que comprometem o equilíbrio de curto prazo.';
        if (context.moduleContext === 'DRE') {
           situacaoAtual = `O desempenho econômico revela compressão crítica, com ${!isNaN(margemLiquida) && margemLiquida < 0 ? 'margens negativas materiais' : 'baixa rentabilidade operacional'}.`;
        } else if (context.moduleContext === 'DFC') {
           situacaoAtual = `A dinâmica de caixa sinaliza exaustão, com ${!isNaN(fco) && fco < 0 ? 'queima de caixa operacional recorrente' : 'tesouraria sob forte pressão'}.`;
        }

        prioridadeEstrategica = isPatrimonial
          ? `Recomposição urgente de liquidez, estancamento de consumo de capital e mitigação da ${qDependencia}.`
          : 'Recomposição urgente de caixa, contenção de expansão e alongamento de passivos operacionais.';
        outlook = 'O cenário exige foco total em sobrevivência e gestão emergencial até a normalização dos indicadores vitais.';
        break;

      case 'WARNING':
        situacaoAtual = isPatrimonial
          ? `A estrutura patrimonial é funcional, porém apresenta pontos de atenção como ${qAlavancagem} e ${qLiquidez}, exigindo monitoramento ativo.`
          : 'O modelo de operação apresenta viabilidade, mas com margens sob pressão e necessidade de ganho de eficiência operacional.';
        if (context.moduleContext === 'DRE') {
           situacaoAtual = `A geração de resultados é viável, porém o EBITDA de ${!isNaN(ebitda) ? ebitda.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'nível restrito'} aponta para pressões de custo.`;
        } else if (context.moduleContext === 'DFC') {
           situacaoAtual = 'A geração de caixa cobre as necessidades básicas, mas apresenta oscilações que reduzem a margem de segurança.';
        }

        prioridadeEstrategica = isPatrimonial
          ? `Prudência na alocação de recursos, otimização de capital de giro e esforços para garantir ${qAutonomia}.`
          : 'Prudência na alocação, otimização do capital de giro, redução de concentração de riscos e disciplina na execução.';
        outlook = 'Cenário estável no curto prazo, exigindo gestão cuidadosa da estrutura de capital para transição a um estado de maior resiliência.';
        break;

      case 'HEALTHY':
        situacaoAtual = isPatrimonial
          ? `Estrutura patrimonial resiliente, destacando-se por ${qLiquidez}, ${qAlavancagem} e ${qAutonomia}, suportando adequadamente o ciclo da operação.`
          : 'A operação demonstra forte capacidade de geração de valor, com indicadores consistentes de rentabilidade e conversão em caixa.';
        if (context.moduleContext === 'DRE') {
           situacaoAtual = `Rentabilidade robusta com margens resilientes e EBITDA de ${!isNaN(ebitda) ? ebitda.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'alto valor agregado'}.`;
        } else if (context.moduleContext === 'DFC') {
           situacaoAtual = `A operação é altamente geradora de caixa, sustentando suas obrigações por meio de um FCO robusto de ${!isNaN(fco) ? fco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'excelência'}.`;
        }

        prioridadeEstrategica = isPatrimonial
          ? `Manutenção da disciplina na estrutura de capital, garantindo ${qDependencia} e alocação eficiente de excedentes.`
          : 'Otimização operacional, alocação eficiente de excedentes e expansão sustentável com disciplina financeira.';
        outlook = 'O cenário atual oferece fundamentos robustos e flexibilidade financeira para sustentar planos de crescimento de forma sustentável.';
        break;
    }

    return { situacaoAtual, prioridadeEstrategica, outlook };
  }

  /**
   * Generates the final Strategic Opinion using the unified framework
   */
  public static deriveStrategicOpinion(context: ExecutiveAnalysisContext): StrategicOpinion {
    const isComplete = this.checkDriverCompleteness(context);
    const severityState = this.determineSeverityState(context);
    const { situacaoAtual, prioridadeEstrategica, outlook } = this.synthesizeComponents(context, severityState);

    const rawNarrative = `Situação Atual: ${situacaoAtual} Prioridade Estratégica: ${prioridadeEstrategica} Outlook: ${outlook}`;
    
    // Pass everything through the semantic guardrail to enforce vocabulary coherence
    const safeSituacao = ExecutiveSemanticBoundaryGuard.sanitize(situacaoAtual, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safePrioridade = ExecutiveSemanticBoundaryGuard.sanitize(prioridadeEstrategica, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safeOutlook = ExecutiveSemanticBoundaryGuard.sanitize(outlook, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safeFullNarrative = ExecutiveSemanticBoundaryGuard.sanitize(rawNarrative, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');

    return {
      situacaoAtual: severityState === 'NEUTRAL' ? situacaoAtual : safeSituacao,
      prioridadeEstrategica: severityState === 'NEUTRAL' ? prioridadeEstrategica : safePrioridade,
      outlook: severityState === 'NEUTRAL' ? outlook : safeOutlook,
      fullNarrative: severityState === 'NEUTRAL' ? rawNarrative : safeFullNarrative,
      severityState,
      isComplete
    };
  }
}
