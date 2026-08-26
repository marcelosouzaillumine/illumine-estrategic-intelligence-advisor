import { SignalConfidence } from '../../contracts/IntelligenceSignal';

export class SignalConfidenceEngine {
  /**
   * Confidence is derived from the amount and quality of historical periods,
   * not just a flat number of years.
   */
  static evaluate(history: any[]): SignalConfidence {
    const periodsAnalyzed = history ? history.length : 0;
    
    // 1 period: low confidence (cannot determine trajectory/persistence)
    if (periodsAnalyzed < 2) {
      return 'low';
    }

    // 2 periods: medium confidence
    if (periodsAnalyzed === 2) {
      return 'medium';
    }

    // 3+ periods: high confidence
    if (periodsAnalyzed >= 3) {
      return 'high';
    }

    return 'low';
  }
}
