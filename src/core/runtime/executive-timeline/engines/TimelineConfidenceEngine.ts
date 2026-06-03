// src/core/runtime/executive-timeline/engines/TimelineConfidenceEngine.ts

import { HistoricalRuntimeCycle, TimelineConfidence } from '../executive-timeline-types';

export class TimelineConfidenceEngine {
  public static determine(cycles: HistoricalRuntimeCycle[]): TimelineConfidence {
    if (cycles.length < 2) {
      return 'FAIL_CLOSED';
    }

    const latest = cycles[cycles.length - 1];
    
    // Quarantine triggers fail closed immediately
    if (latest.isQuarantined) {
      return 'FAIL_CLOSED';
    }

    // Lineage broken or missing in the sequence
    const hasBrokenLineage = cycles.some(c => !c.lineageHash || c.lineageHash === 'N/A' || c.lineageHash.includes('broken'));
    if (hasBrokenLineage) {
      return 'FAIL_CLOSED';
    }

    if (cycles.length >= 4) {
      // If restricted, degrade confidence
      if (latest.isRestricted) {
        return 'LOW_CONFIDENCE';
      }
      return 'HIGH_CONFIDENCE';
    }

    if (cycles.length === 3) {
      if (latest.isRestricted) {
        return 'LOW_CONFIDENCE';
      }
      return 'MEDIUM_CONFIDENCE';
    }

    // cycles.length === 2
    return 'LOW_CONFIDENCE';
  }
}
