// src/core/runtime/advisory-narrative/BoardCommunicationEngine.ts
//
// Board Communication Engine
// Adapts advisory narrative specifically for board-level presentation and governance decision-making.

export class BoardCommunicationEngine {
  /**
   * Formulates the board-level strategic briefing, prioritizing capital preservation and fiduciary neutrality.
   */
  public static generateBoardBriefing(report: any, validationResult: any): string {
    const scores = report.scores ?? { structural: 80, capitalPreservation: 80 };
    const capitalPreservation = scores.capitalPreservation ?? scores.structural ?? 80;
    const preservationStatus = report.capitalGovernanceReport?.preservation?.preservationStatus ?? 'PRESERVAÇÃO_SAUDÁVEL';
    const activeProfile = validationResult?.policyProfile ?? report.policyProfile ?? 'BALANCED';

    let briefing = `Relatório Fiduciário ao Conselho de Administração. `;
    briefing += `Sob as diretrizes do perfil de governança "${activeProfile}", a preservação de capital institucional é prioritária. `;
    briefing += `O score de preservação de capital está estabelecido em ${capitalPreservation}/100, classificado sob o status "${preservationStatus}". `;

    const isErosion = preservationStatus === 'EROSÃO_RELEVANTE' || preservationStatus === 'FRAGILIDADE_PATRIMONIAL';
    if (isErosion) {
      briefing += `AVISO DE PRESERVAÇÃO: A existência de erosão patrimonial ativa requer a retenção integral de lucros acumulados e impede qualquer deliberação de distribuição de capital. `;
    } else {
      briefing += `A governança de capital apresenta margem de conformidade para operações ordinárias dentro dos limites de tolerância vigentes. `;
    }

    if (validationResult && !validationResult.isValid) {
      briefing += `Deliberações propostas foram rejeitadas pelo Runtime de Conformidade sob bloqueio com nível de severidade ${validationResult.severity}.`;
    } else {
      briefing += `Não constam restrições constitucionais ativas contra o plano deliberado.`;
    }

    return briefing;
  }
}
