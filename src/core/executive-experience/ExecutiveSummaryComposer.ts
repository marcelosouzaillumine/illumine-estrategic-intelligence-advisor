import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';

export interface PersonaSummary {
  role: string;
  focusTitle: string;
  keyMetricHighlight: string;
  narrativeSummary: string;
  alertCount: number;
}

export class ExecutiveSummaryComposer {
  /**
   * Generates a tailored executive summary for different corporate stakeholder roles
   * without recalculating any financial indicators or changing the source data.
   */
  public static compose(report: ExecutiveIntelligenceReport, role: 'CEO' | 'BOARD' | 'INVESTOR' | 'ADVISOR' | 'OPERATIONAL'): PersonaSummary {
    if (!report) {
      throw new Error('[Summary Composer] Impossível compor a partir de relatório inexistente.');
    }

    const { context, scores, severity, advisory, compliance, runtimeMetadata } = report;
    const alertCount = runtimeMetadata?.performance.warnings.length || 0;

    switch (role) {
      case 'CEO':
        return {
          role: 'CEO',
          focusTitle: 'Foco: Alocação Estratégica e Runway de Crescimento',
          keyMetricHighlight: `Score Composto: ${scores.composite}/100`,
          narrativeSummary: `Resumo do CEO: A empresa atua em estágio de ${context.stage} com severidade operacional avaliada como ${severity.level}. Iniciativa estratégica recomendada: ${advisory.priorityFocus}.`,
          alertCount
        };

      case 'BOARD':
        return {
          role: 'BOARD',
          focusTitle: 'Foco: Governança Fiduciária, Solvência e Riscos de Capital',
          keyMetricHighlight: `Severidade de Risco: ${severity.level}`,
          narrativeSummary: `Resumo do Conselho: Relatório com nível de confiança ${compliance.confidenceLevel}. Rating de estrutura de capital consolidado como passível de monitoramento. Foco fiduciário principal: ${advisory.priorityFocus}.`,
          alertCount
        };

      case 'INVESTOR':
        return {
          role: 'INVESTOR',
          focusTitle: 'Foco: Retorno sobre Capital, Intensidade e Modelo Econômico',
          keyMetricHighlight: `Modelo: ${context.businessModel}`,
          narrativeSummary: `Resumo do Investidor: Segmento de ${context.segment} com classificação de capital ${context.capitalIntensity}. Tendência de solidez institucional avaliada pelo comitê financeiro.`,
          alertCount
        };

      case 'ADVISOR':
        return {
          role: 'ADVISOR',
          focusTitle: 'Foco: Diagnóstico Contábil e Playbook de Mitigação',
          keyMetricHighlight: `Sensibilidade Ativa no Runtime`,
          narrativeSummary: `Resumo do Consultor: Diagnóstico causal indica "${report.causality?.event || 'N/A'}". Solvência sob premissa de insolvência preditiva. Plano de mitigação contém ${advisory.actionMatrix.length} frentes ativas.`,
          alertCount
        };

      case 'OPERATIONAL':
        return {
          role: 'OPERATIONAL',
          focusTitle: 'Foco: Ciclo Financeiro Circulante e Gargalos de Caixa',
          keyMetricHighlight: `Ciclo: ${context.operationalProfile}`,
          narrativeSummary: `Resumo da Operação: Perfil operacional com foco em capital de giro (NCG). Alertas de staging ativos em fila de validação contábil. Ações sugeridas: ${advisory.actionMatrix.join('; ')}. Foco de mitigação: ${advisory.priorityFocus}.`,
          alertCount
        };

      default:
        throw new Error(`[Summary Composer] Persona "${role}" não homologada.`);
    }
  }
}
