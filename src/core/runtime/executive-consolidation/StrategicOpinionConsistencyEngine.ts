import * as ExecutiveSemanticBoundaryGuard from './ExecutiveSemanticBoundaryGuard';
import { ExecutiveNarrativeBuilder } from './ExecutiveNarrativeBuilder';
import { ExecutivePrimaryMotiveConsistencyEngine } from './ExecutivePrimaryMotiveConsistencyEngine';
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
   * Generates the final Strategic Opinion using the unified framework
   */
  public static deriveStrategicOpinion(context: ExecutiveAnalysisContext): StrategicOpinion {
    const isComplete = this.checkDriverCompleteness(context);
    const severityState = this.determineSeverityState(context);
    
    if (severityState === 'NEUTRAL') {
      const situacaoAtual = 'Dados insuficientes para diagnóstico fiduciário completo. Requer mapeamento detalhado dos drivers vitais.';
      const prioridadeEstrategica = 'Normalização da base de dados e consolidação das demonstrações financeiras.';
      const outlook = 'Aguardando informações materiais para projeção estratégica confiável.';
      return {
        situacaoAtual,
        prioridadeEstrategica,
        outlook,
        fullNarrative: `Situação Atual: ${situacaoAtual} Prioridade Estratégica: ${prioridadeEstrategica} Outlook: ${outlook}`,
        severityState,
        isComplete
      };
    }

    const narrativeContext = ExecutivePrimaryMotiveConsistencyEngine.deriveNarrativeContext(context, severityState);

    const situacaoAtual = ExecutiveNarrativeBuilder.buildSituacaoAtual(narrativeContext);
    const prioridadeEstrategica = ExecutiveNarrativeBuilder.buildPrioridadeEstrategica(narrativeContext);
    const outlook = ExecutiveNarrativeBuilder.buildOutlook(narrativeContext);

    const rawNarrative = `Situação Atual: ${situacaoAtual} Prioridade Estratégica: ${prioridadeEstrategica} Outlook: ${outlook}`;
    
    const safeSituacao = ExecutiveSemanticBoundaryGuard.sanitize(situacaoAtual, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safePrioridade = ExecutiveSemanticBoundaryGuard.sanitize(prioridadeEstrategica, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safeOutlook = ExecutiveSemanticBoundaryGuard.sanitize(outlook, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');
    const safeFullNarrative = ExecutiveSemanticBoundaryGuard.sanitize(rawNarrative, severityState === 'CRITICAL' ? 'SEVERE' : 'MONITORING');

    return {
      situacaoAtual: safeSituacao,
      prioridadeEstrategica: safePrioridade,
      outlook: safeOutlook,
      fullNarrative: safeFullNarrative,
      severityState,
      isComplete
    };
  }
}
