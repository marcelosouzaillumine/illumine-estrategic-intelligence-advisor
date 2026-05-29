// src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts
//
// Fiduciary Communication Engine
// Translates validated governance intelligence into neutral, factual fiduciary narrative summaries.

import { AdvisoryAudience } from './advisory-narrative-types';

export class FiduciaryCommunicationEngine {
  /**
   * Generates a neutral, fact-based description of fiduciary exposures and compliance validations.
   */
  public static generateFiduciaryNarrative(
    report: any,
    validationResult: any,
    audience: AdvisoryAudience
  ): string {
    const scores = report.scores ?? { financial: 70, composite: 70, governance: 70 };
    const liquidityScore = scores.liquidity ?? scores.financial ?? 70;
    const compositeScore = scores.composite ?? 70;
    const ocf = report.cashFlowReport?.operational?.fco ?? report.ocf ?? 0;
    const netIncome = report.metrics?.netIncome ?? report.netIncome ?? 0;

    let narrative = `O índice de sobrevivência composto da instituição está mensurado em ${compositeScore}/100. `;
    narrative += `O fluxo de caixa operacional (FCO) do período reportado é de R$ ${ocf.toLocaleString('pt-BR')}, com lucro líquido acumulado de R$ ${netIncome.toLocaleString('pt-BR')}. `;
    narrative += `O score de liquidez da instituição encontra-se atualmente em ${liquidityScore}/100, refletindo a capacidade da tesouraria de honrar compromissos correntes.`;

    if (validationResult) {
      const violations = validationResult.violations ?? [];
      const warnings = validationResult.warnings ?? [];

      if (violations.length > 0) {
        narrative += ` Foram registrados ${violations.length} eventos de desconformidade constitucional ou bloqueios fiduciários ativos.`;
      } else if (warnings.length > 0) {
        narrative += ` Não foram encontrados bloqueios fiduciários ativos, contudo existem ${warnings.length} alertas de atenção cadastrados em runtime.`;
      } else {
        narrative += ` A operação atual encontra-se em conformidade com as restrições constitucionais vigentes.`;
      }
    }

    // Preserve absolute truthfulness across audiences
    if (audience === 'BOARD') {
      narrative += ` Recomenda-se ao Conselho a estrita observância das salvaguardas de capital para mitigar riscos de diluição patrimonial.`;
    }

    return narrative;
  }
}
