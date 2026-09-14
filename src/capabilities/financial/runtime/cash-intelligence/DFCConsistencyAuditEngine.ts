import { ExecutiveRecommendation } from '../../../../core/runtime/executive-consolidation';
import { FiduciaryRunwayClassification } from './RunwayClassificationEngine';

export interface ConsistencyAuditResult {
  isConsistent: boolean;
  violations: string[];
}

export class DFCConsistencyAuditEngine {
  /**
   * Audita a consistência da inteligência executiva de caixa
   */
  public static audit(
    priorities: ExecutiveRecommendation[],
    runwayClass: FiduciaryRunwayClassification,
    cqs: number,
    advisoryText: string,
    fco: number
  ): ConsistencyAuditResult {
    const violations: string[] = [];

    // Rule 1: Priorities compatible with Runway
    if (runwayClass === 'CRITICO' || runwayClass === 'EMERGENCIAL') {
      const hasPreventative = priorities.some(p => p.text.toLowerCase().includes('preventiva'));
      if (hasPreventative) {
        violations.push('DFC_EXECUTIVE_INCONSISTENCY: Runway crítico não pode ter prioridades preventivas.');
      }
      const hasCorrective = priorities.some(p => p.text.toLowerCase().includes('reduzir consumo') || p.text.toLowerCase().includes('consumo operacional'));
      if (!hasCorrective) {
        violations.push('DFC_EXECUTIVE_INCONSISTENCY: Runway crítico exige prioridade de redução de consumo operacional de caixa.');
      }
    }

    // Rule 2: Priorities compatible with CQS
    if (cqs < 30) {
      // Must have corrective
      const hasCorrective = priorities.some(p => p.impact === 'Muito Alto' || p.impact === 'Alto');
      if (!hasCorrective) {
        violations.push('DFC_EXECUTIVE_INCONSISTENCY: CQS < 30 exige prioridade obrigatoriamente corretiva (Alto/Muito Alto impacto).');
      }
    }

    // Rule 3 & 4: Advisory compatible with Diagnosis & Narrative
    if (fco < 0) {
      if (!advisoryText.toLowerCase().includes('consumiu')) {
        violations.push('DFC_EXECUTIVE_INCONSISTENCY: Advisory text incompatible with negative FCO (must mention consumption).');
      }
    }

    return {
      isConsistent: violations.length === 0,
      violations
    };
  }
}
