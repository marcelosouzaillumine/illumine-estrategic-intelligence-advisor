// src/core/runtime/advisory-narrative/GovernanceRecommendationEngine.ts
//
// Governance Recommendation Engine
// Emits guidelines for governance stabilization, discipline, and capital preservation.

import { AdvisoryAudience } from './advisory-narrative-types';

export class GovernanceRecommendationEngine {
  /**
   * Emits structural guidelines for corporate discipline based on institutional fatigue and compliance.
   */
  public static generateGovernanceGuidelines(
    report: any,
    validationResult: any,
    audience: AdvisoryAudience
  ): string {
    const scores = report.scores ?? { governance: 70 };
    const govScore = scores.governance ?? 70;
    const isLeveraged = report.capitalGovernanceReport?.behavior?.overallNarrative?.toLowerCase().includes('alavanca') || false;

    let guidelines = `DIRETRIZES DE ESTABILIZAÇÃO DE GOVERNANÇA:\n`;
    guidelines += `1. Disciplina Decisória: O score de governança está em ${govScore}/100. `;
    
    if (govScore < 50) {
      guidelines += `Recomenda-se instituir comitê de governança extraordinário semanal para autorização de desembolsos acima da materialidade.\n`;
    } else {
      guidelines += `Manter o fluxo regular de aprovação colegiada para decisões de CAPEX e expansão.\n`;
    }

    if (isLeveraged) {
      guidelines += `2. Controle de Alavancagem: A detecção de passivos e alavancagem estrutural exige a proibição de novas captações financeiras de curto prazo até que o índice de endividamento retorne ao patamar seguro.\n`;
    } else {
      guidelines += `2. Alocação de Passivos: Manter estrutura de endividamento sob controle regulamentar.\n`;
    }

    guidelines += `3. Linha de Defesa: Certificar que todas as deliberações futuras sejam previamente submetidas à validação lógica do runtime fiduciário.`;

    return guidelines;
  }
}
