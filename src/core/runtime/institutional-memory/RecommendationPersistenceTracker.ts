import { HistoricalCycleData } from './types';

export class RecommendationPersistenceTracker {
  public static trackIgnored(cycles: HistoricalCycleData[]): string[] {
    if (!cycles || cycles.length < 3) {
      return []; // Fail-closed: no sufficient cycles to track ignore behavior
    }

    // Sort cycles by year ascending (oldest first)
    const sorted = [...cycles].sort((a, b) => a.year - b.year);
    const newestCycle = sorted[sorted.length - 1];
    const newestRecs = newestCycle.recommendations || [];

    const ignored: string[] = [];

    for (const rec of newestRecs) {
      const normalizedRec = rec.toLowerCase().trim();
      let consecutiveCount = 1;

      // Count backwards to check consecutive presence
      for (let i = sorted.length - 2; i >= 0; i--) {
        const prevRecs = sorted[i].recommendations || [];
        const found = prevRecs.some(pr => pr.toLowerCase().trim() === normalizedRec);
        if (found) {
          consecutiveCount++;
        } else {
          break; // Must be consecutive
        }
      }

      if (consecutiveCount >= 3) {
        ignored.push(
          `A recomendação de "${rec}" foi emitida em ${consecutiveCount} ciclos consecutivos sem mitigação relevante.`
        );
      }
    }

    return ignored;
  }
}
