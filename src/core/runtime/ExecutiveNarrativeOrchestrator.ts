import { ExecutiveIntelligenceReport } from './executive-intelligence-runtime';

export interface OrchestratedNarrative {
  title: string;
  leadParagraph: string;
  causalFlowSummary: string;
  sustainabilityVerdict: string;
  fiduciaryDirectives: string[];
}

export class ExecutiveNarrativeOrchestrator {
  public static orchestrate(
    report: ExecutiveIntelligenceReport,
    thesis: string,
    tensions: string[],
    cashFlowNarrative: string,
    capitalGovernanceNarrative: string
  ): OrchestratedNarrative {
    const isStressed = report.scores?.financialStress?.isStressed || report.severity?.level === 'CRÍTICO' || report.severity?.level === 'COLAPSO';

    // Title
    const title = isStressed 
      ? 'RELATÓRIO DE GESTÃO INSTITUCIONAL: ALERTA DE PRESSÃO PATRIMONIAL'
      : 'DIAGNÓSTICO INSTITUCIONAL E OPERACIONAL DO CAPITAL';

    // Lead paragraph
    const leadParagraph = thesis;

    // Causal flow summary
    let causalFlowSummary = '';
    if (tensions.length > 0) {
      causalFlowSummary = `Foram identificados descasamentos estruturais na causabilidade contábil: ${tensions.join(' ')}`;
    } else {
      causalFlowSummary = 'Os demonstrativos financeiros apresentam articulação causal coerente, sem desequilíbrios significativos de fluxo contábil.';
    }

    // Sustainability verdict
    let sustainabilityVerdict = '';
    if (cashFlowNarrative.includes('indisponível') || capitalGovernanceNarrative.includes('indisponível')) {
      sustainabilityVerdict = 'A sustentabilidade financeira e de governança não pôde ser avaliada plenamente devido a dados insuficientes de DFC ou DLPA/DMPL.';
    } else {
      sustainabilityVerdict = `${cashFlowNarrative} ${capitalGovernanceNarrative}`;
    }

    // Fiduciary directives
    const fiduciaryDirectives: string[] = [];
    if (report.advisory?.actionMatrix && report.advisory.actionMatrix.length > 0) {
      report.advisory.actionMatrix.forEach((action: any) => {
        if (action && action.title) {
          fiduciaryDirectives.push(`Diretiva: ${action.title} [Foco: ${action.category}] - Evidência: ${action.fiduciaryEvidence}`);
        }
      });
    }

    if (fiduciaryDirectives.length === 0) {
      fiduciaryDirectives.push('Nenhuma ação corretiva obrigatória identificada com base nos dados fornecidos.');
    }

    return {
      title,
      leadParagraph,
      causalFlowSummary,
      sustainabilityVerdict,
      fiduciaryDirectives
    };
  }
}
