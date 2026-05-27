import { InstitutionalMemoryRecord, RecommendationContinuity } from './types';

export class AdvisoryContinuityEngine {
  /**
   * Scans prior records to determine recommendation repetition and warning ignores.
   * Explicitly exposes originating lineages, timestamps, and confidence.
   */
  public static traceContinuity(records: InstitutionalMemoryRecord[]): RecommendationContinuity[] {
    const map: Record<string, {
      timesIssued: number;
      timestamps: string[];
      lineages: string[];
    }> = {};

    records.forEach(record => {
      const recs = record.recommendationSnapshot || [];
      recs.forEach(rec => {
        const cleanRec = rec.trim();
        if (!map[cleanRec]) {
          map[cleanRec] = {
            timesIssued: 0,
            timestamps: [],
            lineages: []
          };
        }
        map[cleanRec].timesIssued += 1;
        map[cleanRec].timestamps.push(record.timestamp);
        if (record.lineageHash) {
          map[cleanRec].lineages.push(record.lineageHash);
        }
      });
    });

    return Object.entries(map).map(([recommendationText, data]) => {
      const sortedDates = data.timestamps.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      return {
        recommendationText,
        timesIssued: data.timesIssued,
        firstIssuedAt: sortedDates[0],
        lastIssuedAt: sortedDates[sortedDates.length - 1],
        originatingLineages: Array.from(new Set(data.lineages)),
        unresolved: data.timesIssued > 1
      };
    });
  }
}
