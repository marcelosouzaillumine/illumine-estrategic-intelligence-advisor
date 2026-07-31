import { DecisionMemoryRecord } from '../models/DecisionMemoryRecord';

/**
 * Regra 3 - Nenhuma memória fiduciária sem classificação.
 */
export class ClassificationRules {
  /**
   * Verifica se o registro de memória atende aos requisitos mínimos
   * baseados na sua classificação.
   */
  static validateFiduciaryClassification(record: DecisionMemoryRecord): boolean {
    if (record.classification === 'FIDUCIARY_RECORD') {
      // Fiduciary records MUST have board level or c-level authority
      if (record.decisionAuthority !== 'BOARD' && record.decisionAuthority !== 'C_LEVEL') {
        return false;
      }
      
      // Fiduciary records MUST have explicit intent and success criteria
      if (!record.intent || record.intent.successCriteria.length === 0) {
        return false;
      }
    }
    
    return true;
  }
}
