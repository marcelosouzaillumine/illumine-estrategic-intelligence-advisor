import { NormalizedDREPayload } from './DREExecutiveDataMapper';
import { EconomicDiagnosisOutput } from './EconomicDiagnosisEngine';
import { CrossStatementIsolationValidator } from './CrossStatementIsolationValidator';
import { ExecutiveLabelGovernanceRegistry } from '../presentation-governance/ExecutiveLabelGovernanceRegistry';

/**
 * Compressed Executive Advisory output — replaces both "Síntese Executiva" and "Sumário de Conselho".
 * Max 800 characters total.
 */
export interface ExecutiveAdvisoryOutput {
  situacaoAtual: string;
  restricaoPrincipal: string;
  oportunidadePrincipal: string;
  prioridadeEstrategica: string;
  outlook: string;
  /** Full text, max 800 chars, board-ready */
  fullNarrative: string;
  /** Validation: ensures no cross-statement contamination */
  isolationValidated: boolean;
}

export class DREBoardAdvisoryEngine {
  public static generateSynthesis(normalizedDRE: NormalizedDREPayload, diagnosis: EconomicDiagnosisOutput): string {
    const advisory = this.generateExecutiveAdvisory(normalizedDRE, diagnosis);
    return advisory.fullNarrative;
  }

  public static generateExecutiveAdvisory(
    normalizedDRE: NormalizedDREPayload,
    diagnosis: EconomicDiagnosisOutput
  ): ExecutiveAdvisoryOutput {
    if (!normalizedDRE.netRevenue.value && normalizedDRE.netRevenue.source.startsWith('MISSING')) {
      const insufficient = 'Dados insuficientes para análise executiva desta seção.';
      return {
        situacaoAtual: insufficient,
        restricaoPrincipal: insufficient,
        oportunidadePrincipal: insufficient,
        prioridadeEstrategica: insufficient,
        outlook: insufficient,
        fullNarrative: insufficient,
        isolationValidated: true,
      };
    }

    const { primaryConstraint, recoverabilityAssessment, strategicPriority, boardOutlook, valueCreationAssessment } = diagnosis;
    const receitaLiquida = normalizedDRE.netRevenue.value;
    const lucroLiquido = normalizedDRE.netProfit.value;
    const margemBruta = normalizedDRE.grossMargin.value * 100;
    const breakEvenCoverage = normalizedDRE.breakEvenCoverage.value * 100;

    const isPrejuizo = lucroLiquido < 0;
    const recFormatted = `R$ ${(receitaLiquida / 1000).toFixed(1).replace('.', ',')} mil`;

    // Situação Atual (max ~120 chars)
    const situacaoAtual = isPrejuizo
      ? `A companhia encerrou o exercício com receita líquida de ${recFormatted} e resultado líquido negativo, operando abaixo do ponto de equilíbrio com cobertura de ${breakEvenCoverage.toFixed(0)}%.`
      : `A companhia encerrou o exercício com receita líquida de ${recFormatted} e resultado líquido positivo, superando o ponto de equilíbrio operacional.`;

    // Restrição Principal — validada pelo isolamento cross-statement
    const rawConstraint = CrossStatementIsolationValidator.isWithinDREDomain(primaryConstraint)
      ? primaryConstraint
      : 'Estrutura de custos incompatível com o volume de receita atual';
    const restricaoPrincipal = ExecutiveLabelGovernanceRegistry.sanitize(rawConstraint);

    // Oportunidade Principal (domínio DRE exclusivo)
    let oportunidadePrincipal = 'Expansão do volume de receita para diluição da estrutura fixa.';
    if (margemBruta > 40) {
      oportunidadePrincipal = `A margem bruta de ${margemBruta.toFixed(0)}% demonstra potencial de geração de valor. A oportunidade central está em ampliar o volume para absorver a estrutura.`;
    }

    // Prioridade Estratégica
    const prioridadeEstrategica = ExecutiveLabelGovernanceRegistry.sanitize(strategicPriority);

    // Outlook
    const outlook = valueCreationAssessment === 'Sim'
      ? 'A recuperabilidade é Alta. A operação possui fundamentos para expansão sustentável.'
      : `A recuperabilidade é ${recoverabilityAssessment}. ${boardOutlook}`;

    // Full Narrative (max 800 chars)
    const fullNarrative = [
      `SITUAÇÃO: ${situacaoAtual}`,
      `RESTRIÇÃO: ${restricaoPrincipal}.`,
      `OPORTUNIDADE: ${oportunidadePrincipal}`,
      `PRIORIDADE: ${prioridadeEstrategica}.`,
      `OUTLOOK: ${outlook}`,
    ].join('\n').slice(0, 800);

    const isolationValidated = CrossStatementIsolationValidator.validateDRERecommendation(fullNarrative).isValid;

    return {
      situacaoAtual,
      restricaoPrincipal,
      oportunidadePrincipal,
      prioridadeEstrategica,
      outlook,
      fullNarrative,
      isolationValidated,
    };
  }
}
