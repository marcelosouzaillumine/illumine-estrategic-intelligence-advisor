import { GovernedFinancialEntry, ImportViolation } from './types';

export class SilentZeroDetector {
  /**
   * Valida se o valor foi mascarado com zero silenciosamente.
   * Na nova arquitetura, o parser não pode atribuir 0 para um valor falho, deve passar null ou NaN.
   */
  static validate(entry: GovernedFinancialEntry): GovernedFinancialEntry {
    const rawValStr = entry.ocrMetadata.rawText;
    
    if (entry.value === null || isNaN(entry.value)) {
      const violation: ImportViolation = {
        code: 'PARSE_ERROR',
        severity: 'CRITICAL',
        message: `Falha ao interpretar valor monetário na string: "${rawValStr}". O sistema proibiu a conversão silenciosa para 0.`
      };
      
      entry.violations.push(violation);
      entry.status = 'QUARANTINED';
      entry.ocrMetadata.confidence = 0;
    }
    
    // Verifica se é um zero explícito (0, 0.00) ou se foi falha do antigo parser que devolveu 0 por padrão.
    if (entry.value === 0) {
       const isExplicitZero = /^[0.,\s]+$/.test(rawValStr.replace(/[a-zA-Z\s]/g, ''));
       if (!isExplicitZero) {
          const violation: ImportViolation = {
            code: 'SILENT_ZERO',
            severity: 'CRITICAL',
            message: `Valor nulo inferido silenciosamente para a string: "${rawValStr}". Potencial corrupção de importação.`
          };
          entry.violations.push(violation);
          entry.status = 'QUARANTINED';
          entry.ocrMetadata.confidence = 0;
       }
    }

    return entry;
  }
}
