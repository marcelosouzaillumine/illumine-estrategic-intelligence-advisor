import { SignalPersistence } from '../../contracts/IntelligenceSignal';
export class SignalPersistenceEngine {
  /**
   * Evaluates the persistence of a signal by analyzing historical occurrences and metric behavior,
   * not just repeating the alert.
   */
  static evaluate(metricId: string, history: any[], ruleEvaluator?: (period: any) => any[]): SignalPersistence {
    if (!history || history.length < 2) {
      return 'unknown';
    }

    // A signal is structural if the metric has maintained the condition consistently
    // across multiple periods (e.g. at least the last 2 or 3 years).
    let occurrences = 0;
    const recentPeriods = history.slice(-3); // Check up to last 3 periods

    for (const period of recentPeriods) {
       // We re-run the risk engine check for each period to see if the condition was met
       const exposures = ruleEvaluator ? ruleEvaluator(period) : [];
       if (exposures.some(e => e.id === metricId)) {
         occurrences++;
       }
    }

    // If it occurred in all 3 of the last 3 periods, or 2 of the last 2: structural
    if (occurrences === recentPeriods.length) {
      return 'structural';
    }

    // If it only occurred recently (e.g., 1 out of 2, or 1 out of 3), it's a recent shift
    if (occurrences < recentPeriods.length) {
      return 'conjunctural';
    }

    return 'unknown';
  }
}
