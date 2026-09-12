import { ExecutiveAnalysisContext, StrategicOpinionConsistencyEngine } from './StrategicOpinionConsistencyEngine';
import { ExecutiveDecisionPayload, ExecutiveStrategicDiagnosisPayload } from './ExecutiveSynthesisTypes';
import { SynthesisMetricsResolver } from './SynthesisMetricsResolver';
import { ExecutivePrimaryMotiveConsistencyEngine } from './ExecutivePrimaryMotiveConsistencyEngine';
import { ExecutiveNarrativeBuilder } from './ExecutiveNarrativeBuilder';

export class ExecutiveDecisionSynthesisEngine {
  public static generatePayload(context: ExecutiveAnalysisContext): ExecutiveDecisionPayload {
    // Determine the base strategic opinion using the existing consistency engine
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);
    const kpis = SynthesisMetricsResolver.extractKPIs(context);
    
    // We break down the 'fullNarrative' and 'situacaoAtual' into a structured thematic narrative.
    // Ideally, the engines could pass thematic insights directly via context.
    const thematicNarratives = this.generateThematicNarratives(context, opinion.situacaoAtual);
    
    // Board conclusion merges 'outlook' and strategic priorities
    const boardConclusion = {
      title: 'Conclusão para o Conselho',
      content: opinion.outlook
    };

    // Institutional observation merges 'prioridadeEstrategica' and severity
    const institutionalObservation = {
      severity: opinion.severityState.toLowerCase() as 'critical' | 'warning' | 'healthy',
      content: opinion.prioridadeEstrategica
    };

    // One-line summary
    const summary = this.generateOneLineSummary(context, opinion.severityState);

    return {
      summary,
      kpis,
      thematicNarratives,
      boardConclusion,
      institutionalObservation
    };
  }

  public static generateStrategicDiagnosisPayload(context: ExecutiveAnalysisContext): ExecutiveStrategicDiagnosisPayload {
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(context);
    
    // In future versions, this would be explicitly populated by the domain engines.
    const severityLower = opinion.severityState.toLowerCase() as "healthy" | "warning" | "critical" | "neutral";
    const observationSeverity = severityLower === 'critical' ? 'high' : (severityLower === 'warning' ? 'medium' : 'low');
    
    const narrativeContext = ExecutivePrimaryMotiveConsistencyEngine.deriveNarrativeContext(context, opinion.severityState);
    let institutionalObservation = ExecutiveNarrativeBuilder.buildInstitutionalObservation(narrativeContext);
    
    if (context.moduleContext === 'BP') {
      const stage = narrativeContext.strategicStage;
      if (stage === 'recovery') {
        institutionalObservation = "A posição atual indica um contexto de recomposição patrimonial, onde o fortalecimento da liquidez e da qualidade do capital são fatores críticos de sustentação.";
      } else if (stage === 'expansion') {
        institutionalObservation = "O estágio de expansão evidencia a manutenção da disciplina de capital, com impacto observável em estoques e obrigações operacionais de ciclo imediato.";
      } else if (stage === 'capital_allocation') {
        institutionalObservation = "Os níveis de geração de caixa configuram um excedente estrutural, com implicações diretas na eficiência e produtividade do capital retido.";
      }
    }
    
    return {
      analysisYear: context.analysisYear,
      generatedAt: context.generatedAt,
      currentSituation: opinion.situacaoAtual,
      strategicSignificance: opinion.prioridadeEstrategica,
      outlook: opinion.outlook,
      institutionalObservation,
      severityState: severityLower,
      observationSeverity,
      primaryDriver: motive.label,
      dominantStrength: motive.dominantStrength,
      secondaryAttention: motive.secondaryAttention,
      moduleContext: context.moduleContext
    };
  }

  private static generateOneLineSummary(context: ExecutiveAnalysisContext, severity: string): string {
    const moduleName = this.getModuleName(context.moduleContext);
    if (severity === 'CRITICAL') {
      return `Alerta: ${moduleName} apresenta vulnerabilidades materiais que exigem mitigação imediata para proteger a operação.`;
    }
    if (severity === 'WARNING') {
      return `Atenção: ${moduleName} demonstra resiliência parcial com pontos específicos que demandam monitoramento.`;
    }
    return `${moduleName} apresenta robustez e métricas consistentes, sustentando planos de expansão e otimização.`;
  }

  private static getModuleName(module: string): string {
    switch(module) {
      case 'BP': return 'A Estrutura Patrimonial';
      case 'DRE': return 'O Desempenho Econômico';
      case 'DFC': return 'A Geração de Caixa';
      case 'DLPA': return 'A Distribuição de Valor';
      default: return 'O contexto avaliado';
    }
  }

  private static generateThematicNarratives(context: ExecutiveAnalysisContext, situacaoAtual: string) {
    const themes = [];
    
    if (context.moduleContext === 'BP') {
      themes.push({
        title: 'Solvência e Estrutura',
        content: situacaoAtual
      });
      if (context.primaryIndicators?.liquidityScore !== undefined) {
        themes.push({
          title: 'Liquidez Patrimonial',
          content: context.primaryIndicators.liquidityScore > 50 
            ? 'Capacidade adequada para honrar compromissos de ciclo imediato sem estresse material de capital de giro.' 
            : 'Sinais de estrangulamento na capacidade de liquidação de obrigações em ciclos operacionais normais.'
        });
      }
    } else if (context.moduleContext === 'DRE') {
      themes.push({
        title: 'Geração de Valor',
        content: situacaoAtual
      });
      if (context.primaryIndicators?.profitabilityScore !== undefined) {
        themes.push({
          title: 'Eficiência Operacional',
          content: context.primaryIndicators.profitabilityScore > 50
            ? 'Margens resilientes com repasse adequado de custos e controle prudente de despesas corporativas.'
            : 'Compressão de margens indicando ineficiências operacionais ou incapacidade de repasse tarifário.'
        });
      }
    } else if (context.moduleContext === 'DFC') {
      themes.push({
        title: 'Fluxo Operacional',
        content: situacaoAtual
      });
      if (context.primaryIndicators?.liquidityScore !== undefined) {
        themes.push({
          title: 'Sustentabilidade de Caixa',
          content: context.primaryIndicators.liquidityScore > 50
            ? 'Geração de caixa robusta, autofinanciando o ciclo operacional sem dependência sistêmica de capital de terceiros.'
            : 'Queima de caixa acelerada requerendo intervenção na política de capital de giro ou novas captações.'
        });
      }
    } else {
      themes.push({
        title: 'Análise Estrutural',
        content: situacaoAtual
      });
    }

    return themes;
  }
}
