// src/core/runtime/publication-governance/BoardPackGovernanceEngine.ts
//
// Board Pack Governance Engine
// Verifies board pack completeness and scenario consistency before consiglio-level releasing.

import { PublicationArtifactType } from './publication-types';

export class BoardPackGovernanceEngine {
  /**
   * Asserts whether a board pack contains all required fiduciary and simulation components.
   */
  public static validateBoardPack(
    report: any,
    artifactType: PublicationArtifactType
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (artifactType !== 'BOARD_PACK') {
      return { isValid: true, errors: [] };
    }

    // 1. Core report components presence checks
    if (!report.cashSustainabilityReport) {
      errors.push('BOARD PACK COMPLIANCE: Relatório de sustentabilidade de caixa (DFC) obrigatório ausente.');
    }
    if (!report.capitalGovernanceReport) {
      errors.push('BOARD PACK COMPLIANCE: Relatório de governança de capital (DLPA) obrigatório ausente.');
    }
    if (!report.treasuryIntelligenceReport) {
      errors.push('BOARD PACK COMPLIANCE: Painel soberano de inteligência de tesouraria obrigatório ausente.');
    }

    // 2. Scenario simulation verification
    if (report.policyContext?.activeProfile === 'TURNAROUND' && !report.scenarioProjections) {
      // For turnaround profiles, simulations are constitutionally required in board packs
      errors.push('BOARD PACK COMPLIANCE: Projeções de contexto simuladas obrigatórias para perfil TURNAROUND ausentes.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
