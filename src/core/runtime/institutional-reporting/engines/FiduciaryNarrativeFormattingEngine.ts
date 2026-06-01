// src/core/runtime/institutional-reporting/engines/FiduciaryNarrativeFormattingEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';

export class FiduciaryNarrativeFormattingEngine {
  
  /**
   * Applies the "Narrative Guard" to prevent optimistic overrides or taxonomy inversion.
   * If the trajectory is bad, or confidence is low, it blocks positive semantic rendering.
   */
  public static format(report: ExecutiveIntelligenceReport, rawNarrative: string, targetVariant: string): string {
    const isRestricted = this.hasFiduciaryRestrictions(report);
    const hasDistress = report.compliance?.confidenceLevel === 'LOW' || report.treasuryIntelligenceReport?.severity === 'CRITICAL';

    let formatted = rawNarrative;

    // Narrative Guard: Remove optimistic adjectives in distress
    if (isRestricted || hasDistress) {
      const optimisticWords = [/crescimento sustentável/gi, /liquidez robusta/gi, /recuperação consolidada/gi, /alta margem de segurança/gi];
      for (const pattern of optimisticWords) {
        formatted = formatted.replace(pattern, '[REDACTED: BLOCKED_BY_FIDUCIARY_GUARD]');
      }
    }

    if (hasDistress) {
      formatted = `[FIDUCIARY SEVERITY: HIGH]\n` + formatted;
    }

    // Specific variant adaptations
    if (targetVariant === 'BANKING' || targetVariant === 'INVESTOR') {
      // Ensure no smoothing for external parties
      if (isRestricted) {
        formatted = `[RESTRICTED FIDUCIARY NOTICE: AVALIAÇÃO OTIMISTA BLOQUEADA DEVIDO A RISCO LONGITUDINAL]\n\n` + formatted;
      }
    }

    return formatted;
  }

  private static hasFiduciaryRestrictions(report: ExecutiveIntelligenceReport): boolean {
    if (report.strategicIntelligence?.posture === 'UNVERIFIABLE_POSTURE') {
      return true;
    }
    return false;
  }
}
