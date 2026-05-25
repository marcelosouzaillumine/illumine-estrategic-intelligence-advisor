import { GovernedFinancialEntry } from './types';

export class ImportConfidenceEngine {
  /**
   * Avalia a confiança global de uma entrada baseada nos metadados.
   */
  static evaluate(entry: GovernedFinancialEntry): GovernedFinancialEntry {
    let globalConfidence = 100;

    if (entry.ocrMetadata.confidence < 100) {
      globalConfidence = Math.min(globalConfidence, entry.ocrMetadata.confidence);
    }

    if (entry.deParaMetadata && entry.deParaMetadata.confidence < 100) {
       globalConfidence = Math.min(globalConfidence, entry.deParaMetadata.confidence);
    }

    if (entry.violations.length > 0) {
      const hasCritical = entry.violations.some(v => v.severity === 'CRITICAL');
      const hasHigh = entry.violations.some(v => v.severity === 'HIGH');
      
      if (hasCritical) globalConfidence = 0;
      else if (hasHigh) globalConfidence = Math.min(globalConfidence, 50);
      else globalConfidence = Math.min(globalConfidence, 80);
    }

    if (globalConfidence < 70 && entry.status !== 'QUARANTINED') {
      entry.status = 'NEEDS_REVIEW';
    }

    // Se o de-para exige validação humana, entra em quarentena ou review obrigatoriamente
    if (entry.deParaMetadata?.requiresHumanValidation && entry.status === 'APPROVED') {
       entry.status = 'NEEDS_REVIEW';
    }

    return entry;
  }
}
