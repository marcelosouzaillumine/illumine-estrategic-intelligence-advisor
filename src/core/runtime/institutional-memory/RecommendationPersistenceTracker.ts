import { LedgerEvent, InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';

export interface PersistentRecommendation {
  recommendation: string;
  consecutiveCycles: number;
  status: 'NEW' | 'PERSISTENT' | 'CRITICAL_IGNORANCE';
}

export class RecommendationPersistenceTracker {
  public static trackIgnored(cycles: any[]): string[] {
    const recMap = new Map<string, number>();
    for (const cycle of cycles) {
      if (cycle.recommendations) {
        for (const rec of cycle.recommendations) {
          recMap.set(rec, (recMap.get(rec) || 0) + 1);
        }
      }
    }
    const ignored: string[] = [];
    for (const [rec, count] of recMap.entries()) {
      if (count >= 3) ignored.push(`${rec} (ignorado em 3 ciclos consecutivos)`);
    }
    return ignored;
  }

  /**
   * Reads from the ledger to track if recommendations are being ignored across cycles.
   * Only looks at domain = 'recommendation'.
   */
  public static track(ledger: InstitutionalDecisionLedger): PersistentRecommendation[] {
    const events = ledger.getEventsByDomain('recommendation');
    
    // Group by recommendation text (evidence[0]) or eventType
    const recMap = new Map<string, LedgerEvent[]>();

    for (const e of events) {
      const key = e.eventType; // Assuming eventType holds the recommendation canonical name
      if (!recMap.has(key)) {
        recMap.set(key, []);
      }
      recMap.get(key)!.push(e);
    }

    const results: PersistentRecommendation[] = [];

    for (const [key, occurrences] of recMap.entries()) {
      // For simplicity, we just count occurrences. In a real time-series, we would verify consecutiveness via cycleId.
      const consecutiveCycles = occurrences.length;

      let status: 'NEW' | 'PERSISTENT' | 'CRITICAL_IGNORANCE' = 'NEW';
      if (consecutiveCycles === 2) status = 'PERSISTENT';
      if (consecutiveCycles >= 3) status = 'CRITICAL_IGNORANCE';

      results.push({
        recommendation: key,
        consecutiveCycles,
        status
      });
    }

    return results;
  }
}
