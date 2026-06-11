import { ExecutiveAnalysisContext, StrategicOpinionConsistencyEngine } from './StrategicOpinionConsistencyEngine';
import { ExecutiveDecisionPayload } from './ExecutiveSynthesisTypes';
import { SynthesisMetricsResolver } from './SynthesisMetricsResolver';

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

    // Priority recommendation merges 'prioridadeEstrategica' and severity
    const priorityRecommendation = {
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
      priorityRecommendation
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
      default: return 'O cenário avaliado';
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
            ? 'Capacidade adequada para honrar compromissos de curto prazo sem estresse material de capital de giro.' 
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
