// src/core/runtime/publication-governance/ReportIntegrityEngine.ts
//
// Report Integrity Engine
// Validates cross-runtime metrics coherence, lineage continuity, and severity propagation consistency.

export class ReportIntegrityEngine {
  /**
   * Performs structural and runtime consistency validations on report context.
   */
  public static validateIntegrity(
    report: any,
    validationResult: any
  ): { isConsistent: boolean; errors: string[] } {
    const errors: string[] = [];

    // 1. Lineage Continuity Check
    const lineageHash = validationResult?.certification?.signature ?? report.lineageHash;
    if (!lineageHash || lineageHash === 'lineage_unverified' || lineageHash === 'lineage_dfc_0') {
      errors.push('INTEGRIDADE DE PUBLICAÇÃO: Lineage quebrado ou assinatura fiduciária inválida.');
    }

    // 2. Cross-Runtime Contradictions Check
    const reportLevel = report.severity?.level ?? 'ESTÁVEL';
    const validationSeverity = validationResult?.severity ?? 'SAFE';

    // A. Fail-closed state contradiction
    const isFailClosed = validationResult?.violations?.some((v: string) => v.includes('fail-closed') || v.includes('FAIL_CLOSED')) || false;
    if (isFailClosed && (validationSeverity === 'SAFE' || reportLevel === 'ESTÁVEL')) {
      errors.push('CONTRADIÇÃO DE SEVERIDADE: Fail-closed ativo em compliance conflitando com status geral saudável.');
    }

    // B. Treasury Intelligence Contradiction
    if (report.treasuryIntelligenceReport) {
      const treasurySev = report.treasuryIntelligenceReport.severity;
      const isTreasuryCritical = treasurySev === 'CRITICAL' || treasurySev === 'TREASURY_RUPTURE_RISK';
      if (isTreasuryCritical && (reportLevel === 'SAUDÁVEL' || reportLevel === 'ESTÁVEL')) {
        errors.push('CONTRADIÇÃO DE SEVERIDADE: Riscos críticos de tesouraria escalados conflitando com status geral saudável.');
      }
    }

    // C. Cash Sustainability Contradiction
    if (report.cashSustainabilityReport) {
      const isCashCritical = report.cashSustainabilityReport.continuityRisk?.continuityRisk === 'CRITICAL' || report.cashSustainabilityReport.continuityRisk?.hasRuptureRisk;
      if (isCashCritical && (reportLevel === 'SAUDÁVEL' || reportLevel === 'ESTÁVEL')) {
        errors.push('CONTRADIÇÃO DE SEVERIDADE: Alerta crítico de caixa ativo em DFC conflitando com status geral saudável.');
      }
    }

    return {
      isConsistent: errors.length === 0,
      errors
    };
  }
}
