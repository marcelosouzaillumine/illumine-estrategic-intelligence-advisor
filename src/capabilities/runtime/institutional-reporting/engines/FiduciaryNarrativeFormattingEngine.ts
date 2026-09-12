// src/core/runtime/institutional-reporting/engines/FiduciaryNarrativeFormattingEngine.ts

import { ExecutiveIntelligenceReport } from '../../../../core/runtime/executive-intelligence-runtime';
import { ReportVariant } from '../institutional-reporting-types';

export class FiduciaryNarrativeFormattingEngine {
  
  /**
   * Applies the "Narrative Guard" to prevent optimistic overrides or taxonomy inversion.
   * Modulates emphasis based on target variant.
   */
  public static format(report: ExecutiveIntelligenceReport, rawNarrative: string, targetVariant: ReportVariant | string): string {
    const isRestricted = !!(report.advisory?.fiduciaryEnforcement?.fiduciaryRestrictions?.length);
    const hasDistress = report.compliance?.confidenceLevel === 'LOW_CONFIDENCE' || report.treasuryIntelligenceReport?.severity === 'CRITICAL';

    let formatted = rawNarrative;

    // Narrative Guard: Remove optimistic adjectives in distress
    if (isRestricted || hasDistress) {
      const optimisticWords = [/crescimento sustentável/gi, /liquidez robusta/gi, /recuperação consolidada/gi, /alta margem de segurança/gi, /excelente desempenho/gi, /crescimento acelerado/gi];
      for (const pattern of optimisticWords) {
        formatted = formatted.replace(pattern, '[REDACTED: BLOCKED_BY_FIDUCIARY_GUARD]');
      }
    }

    if (hasDistress) {
      formatted = `> **[FIDUCIARY SEVERITY: HIGH - DISTRESS LEVEL DETECTED]**\n\n` + formatted;
    }
    
    if (isRestricted && (targetVariant === 'BANKING' || targetVariant === 'INVESTOR')) {
      formatted = `> **[RESTRICTED FIDUCIARY NOTICE: AVALIAÇÃO OTIMISTA BLOQUEADA DEVIDO A RISCO LONGITUDINAL]**\n\n` + formatted;
    }

    return this.applyVariantEmphasis(report, formatted, targetVariant);
  }

  private static applyVariantEmphasis(report: ExecutiveIntelligenceReport, baseNarrative: string, variant: string): string {
    let preamble = '';
    
    switch (variant) {
      case 'BANKING':
        preamble = `### Foco de Análise: Solvência e Liquidez\n*Ênfase em capacidade de pagamento, funding, covenants e blindagem de garantias.*\n\n`;
        break;
      case 'INVESTOR':
        preamble = `### Foco de Análise: Geração de Valor\n*Ênfase em ROIC/EVA, alocação de capital e crescimento sustentável estrutural.*\n\n`;
        break;
      case 'AUDIT':
        preamble = `### Foco de Análise: Integridade e Conformidade\n*Ênfase estrita em restrições fiduciárias, lineage, fail-closed events e integridade contábil.*\n\n`;
        break;
      case 'TURNAROUND':
        preamble = `### Foco de Análise: Estabilização e Sobrevivência\n*Ênfase em riscos críticos de continuidade, mitigação de colapso de caixa e intervenção estrutural.*\n\n`;
        break;
      case 'BOARD':
      case 'MANAGEMENT':
      default:
        // No specific preamble for standard internal variants
        break;
    }

    return preamble + baseNarrative;
  }

  private static hasFiduciaryRestrictions(report: ExecutiveIntelligenceReport): boolean {
    if (report.strategicIntelligence?.posture === 'UNVERIFIABLE_POSTURE') {
      return true;
    }
    if (report.advisory?.fiduciaryEnforcement?.complianceStatus === 'FAILED') {
      return true;
    }
    return false;
  }
}
