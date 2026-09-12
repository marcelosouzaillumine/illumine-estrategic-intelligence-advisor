import { InstitutionalContextProfile } from '../../capabilities/runtime/institutional-context/types';
import { ContinuityStatus } from '../../capabilities/runtime/institutional-memory/InstitutionalContinuityResolver';

export type DomainPresenceStatus = {
  hasBP: boolean;
  hasDRE: boolean;
  hasDFC: boolean;
  historicalCycles: number;
};

export type DisclosurePayload = {
  isCritical: boolean;
  primaryDisclosure: string | null;
  secondaryDisclosures: string[];
  blockedSections: string[];
};

export class UnifiedDisclosureEngine {
  /**
   * Weights determining the severity of absence for each domain.
   */
  private static readonly CONFIDENCE_WEIGHTS = {
    BP_ABSENT: 40,   // Critical: Sem patrimônio, não há solvência verificável.
    DRE_ABSENT: 30,  // Alta: Sem resultado, não há rentabilidade ou break-even.
    DFC_ABSENT: 20,  // Moderada: Sem caixa livre, qualidade da receita é presumida, mas não provada.
    NO_HISTORY: 10   // Baixa: Sem histórico, visão é apenas estática.
  };

  /**
   * Resolução absoluta e soberana de disclosures institucionais.
   */
  public static resolve(
    presence: DomainPresenceStatus,
    ctx: InstitutionalContextProfile,
    continuityStatus: ContinuityStatus = 'INCONCLUSIVO',
    persistentIgnoranceCount: number = 0
  ): DisclosurePayload {
    const isSingleYear = presence.historicalCycles <= 1;
    const isDistressed = ctx.legacy?.businessStage === 'TURNAROUND_DISTRESS';

    const blockedSections: string[] = [];
    const secondaryDisclosures: string[] = [];
    let primaryDisclosure: string | null = null;
    let severityScore = 0;

    // 1. Calculate Confidence Severity
    if (!presence.hasBP) severityScore += this.CONFIDENCE_WEIGHTS.BP_ABSENT;
    if (!presence.hasDRE) severityScore += this.CONFIDENCE_WEIGHTS.DRE_ABSENT;
    if (!presence.hasDFC) severityScore += this.CONFIDENCE_WEIGHTS.DFC_ABSENT;
    if (isSingleYear) severityScore += this.CONFIDENCE_WEIGHTS.NO_HISTORY;

    // 2. Resolve Primary Disclosure (Top priority omission)
    if (!presence.hasBP) {
      primaryDisclosure = 'DADOS ESTRUTURAIS INDISPONÍVEIS: Impossível atestar solvência ou liquidez institucional sem Balanço Patrimonial.';
      blockedSections.push('Solvência Estrutural', 'Estrutura de Capital', 'Score de Risco');
    } else if (!presence.hasDRE) {
      primaryDisclosure = 'DADOS OPERACIONAIS INDISPONÍVEIS: Impossível calcular rentabilidade, margens ou unit economics sem DRE.';
      blockedSections.push('Rentabilidade Operacional', 'Eficiência de Custos', 'Score de Operação');
    } else if (!presence.hasDFC) {
      primaryDisclosure = 'QUALIDADE DO CAIXA NÃO VERIFICÁVEL: Avaliação de DFC ausente compromete a validação de conversão de caixa e sustentabilidade real de lucros.';
      blockedSections.push('Análise de Conversão de Caixa', 'Sustentabilidade de Dividendos');
    } else if (isSingleYear) {
      primaryDisclosure = 'DIAGNÓSTICO ESTÁTICO: Análise restrita ao contexto atual devido à insuficiência de ciclos históricos para inferência longitudinal.';
      blockedSections.push('Análise de Tendência', 'Crescimento Sustentável', 'Evolução Histórica');
    }

    // 3. Resolve Secondary Disclosures & Constraints
    if (isSingleYear && presence.hasBP && presence.hasDRE) {
      secondaryDisclosures.push('Limitação Longitudinal: Sem histórico, não há base fiduciária para atestar crescimento estrutural.');
    }

    if (isDistressed) {
      secondaryDisclosures.push('Alerta Fiduciário: O modelo operacional aciona restrições severas sobre teses de expansão e foco restrito à proteção de caixa.');
    }

    if (!presence.hasDFC && presence.hasDRE) {
      secondaryDisclosures.push('Risco de Qualidade de Receita: Lucro Líquido atestado na DRE carece de validação de efetivo recebimento em caixa.');
    }

    if (continuityStatus === 'DETERIORAÇÃO_PROGRESSIVA') {
      secondaryDisclosures.push('Alerta Evolutivo: O histórico evidencia deterioração operacional/financeira recorrente. Análise estática não deve ser lida isoladamente.');
    }

    if (persistentIgnoranceCount >= 1) {
      secondaryDisclosures.push(`Risco de Governança: Foram identificadas ${persistentIgnoranceCount} recomendações estruturais ignoradas reiteradamente em ciclos anteriores.`);
    }

    return {
      isCritical: severityScore >= 40,
      primaryDisclosure,
      secondaryDisclosures,
      blockedSections
    };
  }
}
