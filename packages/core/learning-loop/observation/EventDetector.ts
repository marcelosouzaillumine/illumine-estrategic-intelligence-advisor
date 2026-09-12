import { DecisionMemoryRecord } from '../../institutional-memory/models/DecisionMemoryRecord';

export class EventDetector {
  /**
   * Identifica se uma decisão atingiu seu horizonte temporal e precisa de validação.
   */
  static identifyPendingReviews(records: DecisionMemoryRecord[]): DecisionMemoryRecord[] {
    const now = new Date();
    return records.filter(record => {
      // Regra genérica: se tem outcome expectation e o tempo passou, e não tem review
      if (record.expectedOutcome && !record.review) {
        const horizonDate = new Date(record.decisionDate);
        horizonDate.setDate(horizonDate.getDate() + record.expectedOutcome.horizonDays);
        return now >= horizonDate;
      }
      return false;
    });
  }
}
