import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';

export interface StorylineBlock {
  title: string;
  narrative: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

export interface ExecutiveStoryline {
  headline: string;
  contextMessage: string;
  priorityBlocks: StorylineBlock[];
  relevanceRating: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class ExecutiveStorytellingEngine {
  /**
   * Transforms an ExecutiveIntelligenceReport into a high-level storytelling narrative.
   * This class operates fiduciarily and passively: it does NOT calculate scores,
   * infer new causal links, or create recommendations without backing.
   */
  public static composeStoryline(report: ExecutiveIntelligenceReport, stakeholderRole: 'CEO' | 'BOARD' | 'INVESTOR' | 'ADVISOR' | 'OPERATIONAL'): ExecutiveStoryline {
    if (!report) {
      throw new Error('[Executive Storytelling] Impossível compor narrativa a partir de relatório vazio.');
    }

    const { context, scores, severity, advisory, compliance, institutionalMemory } = report;

    // 1. Contextualize and Humanize the Headline based on active metrics in the report
    const hasStress = scores.financialStress?.isStressed || false;
    const severityLevel = severity.level;
    
    let headline = '';
    let relevanceRating: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

    if (hasStress || severityLevel === 'CRÍTICO' || severityLevel === 'COLAPSO' || severityLevel === 'ESTRESSADO') {
      headline = `Atenção Executiva Requerida: Operação em estado de ${severityLevel} sob modelo ${context.businessModel}`;
      relevanceRating = 'HIGH';
    } else {
      headline = `Sumário Corporativo: Estabilidade Operacional Classificada como ${severityLevel}`;
      relevanceRating = severityLevel === 'SAUDÁVEL' ? 'LOW' : 'MEDIUM';
    }

    // 2. Humanize contextual message
    let contextMessage = `A empresa atua no segmento de ${context.segment} (${context.capitalIntensity}) em estágio de ${context.stage}. `;
    if (compliance.confidenceLevel === 'LOW_CONFIDENCE') {
      contextMessage += 'Aviso: Análise com suficiência de dados limitada pelo modo de execução.';
    } else {
      contextMessage += 'Análise respaldada por histórico completo e auditorias de staging válidas.';
    }

    if (institutionalMemory && institutionalMemory.historicalDensityRequirement === 'SUFFICIENT') {
      contextMessage += ` Rastreabilidade de padrões históricos ativa (${institutionalMemory.recurrenceSeverity}).`;
    }

    // 3. Build prioritized storyline blocks, ONLY using data already calculated in the report
    const priorityBlocks: StorylineBlock[] = [];

    // Block 1: Financial Health & Performance Overview
    priorityBlocks.push({
      title: 'Saúde Contábil & Performance',
      narrative: `Pontuação financeira de ${scores.financial}/100 e estrutural de ${scores.structural}/100. O score composto consolidado situa-se em ${scores.composite}.`,
      type: scores.composite >= 75 ? 'success' : scores.composite >= 50 ? 'info' : 'warning'
    });

    // Block 2: Causal Diagnosis
    if (report.causality) {
      const { event, rootCause, strategicImpact } = report.causality;
      priorityBlocks.push({
        title: 'Causalidade e Evento Raiz',
        narrative: `Diagnóstico: ${event}. Causa Raiz: ${rootCause}. Impacto Estratégico: ${strategicImpact}.`,
        type: hasStress ? 'critical' : 'info'
      });
    }

    // Block 3: Compliance & Telemetry Warnings
    const activeWarnings = report.runtimeMetadata?.performance.warnings || [];
    if (activeWarnings.length > 0) {
      priorityBlocks.push({
        title: 'Integridade & Observabilidade',
        narrative: `Telemetria de confiança classificada como ${compliance.confidenceLevel}. Detectados ${activeWarnings.length} avisos de execução no Runtime.`,
        type: compliance.confidenceLevel === 'LOW_CONFIDENCE' ? 'critical' : 'warning'
      });
    }

    // Block 4: Recommended Action Plan
    priorityBlocks.push({
      title: 'Diretriz de Mitigação Prioritária',
      narrative: `Foco principal: ${advisory.priorityFocus}. Plano de ação contém ${advisory.actionMatrix.length} iniciativas sugeridas pelo comitê de controle.`,
      type: hasStress ? 'critical' : 'success'
    });

    // Custom filtering/sorting by stakeholder priority (only organizing/formatting)
    if (stakeholderRole === 'CEO') {
      // Focus on strategy and actions
      return {
        headline,
        contextMessage,
        priorityBlocks: priorityBlocks.filter(b => b.title !== 'Integridade & Observabilidade'),
        relevanceRating
      };
    }

    if (stakeholderRole === 'BOARD') {
      // Focus on compliance and solvency
      return {
        headline,
        contextMessage: `DOCUMENTO CONFIDENCIAL DO CONSELHO. ${contextMessage}`,
        priorityBlocks: priorityBlocks.filter(b => b.title !== 'Saúde Contábil & Performance'),
        relevanceRating
      };
    }

    return {
      headline,
      contextMessage,
      priorityBlocks,
      relevanceRating
    };
  }
}
