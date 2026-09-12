// src/core/runtime/advisory-narrative/ExecutiveSummaryEngine.ts
//
// Executive Summary Engine
// Formulates executive-ready summaries and highlights key recommendations.

import { AdvisoryAudience } from './advisory-narrative-types';
import { ScenarioCategory } from '../../capabilities/runtime/strategic-simulation/simulation-types';

export class ExecutiveSummaryEngine {
  /**
   * Generates a board-ready summary statement containing key takeaways.
   */
  public static generateSummary(
    report: any,
    recommendedPath: ScenarioCategory,
    audience: AdvisoryAudience
  ): string {
    const scores = report.scores ?? { composite: 70 };
    const composite = scores.composite ?? 70;
    const activeProfile = report.tenantConfig?.policyProfile || report.policyProfile || 'BALANCED';

    let summary = `SUMÁRIO EXECUTIVO (Audiência: ${audience}):\n`;
    summary += `- Status Geral: Sobrevivência composta em ${composite}/100 sob o perfil de política "${activeProfile}".\n`;
    summary += `- Diretriz Recomendada: Adoção imediata da rota de "${recommendedPath}" para preservação de liquidez.\n`;
    
    if (composite < 50) {
      summary += `- Alerta Crítico: A instituição opera em regime de restrição fiduciária estrita. Recomenda-se suspensão de CAPEX discricionário.`;
    } else {
      summary += `- Recomendação Geral: Manter governança de caixa regular e monitoramento de desvios operacionais.`;
    }

    return summary;
  }
}
