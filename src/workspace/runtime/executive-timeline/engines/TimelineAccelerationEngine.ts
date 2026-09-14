// src/core/runtime/executive-timeline/engines/TimelineAccelerationEngine.ts

import { HistoricalRuntimeCycle, AccelerationState } from '../executive-timeline-types';

export class TimelineAccelerationEngine {
  public static evaluate(cycles: HistoricalRuntimeCycle[]): AccelerationState {
    if (cycles.length < 3) {
      return 'NEUTRAL_ACCELERATION';
    }

    const n = cycles.length;
    const current = cycles[n - 1].compositeScore;
    const previous = cycles[n - 2].compositeScore;
    const older = cycles[n - 3].compositeScore;

    const diffCurrent = current - previous;
    const diffPrevious = previous - older;

    if (diffCurrent > 0 && diffCurrent > diffPrevious) {
      return 'POSITIVE_ACCELERATION';
    }

    if (diffCurrent < 0 && diffCurrent < diffPrevious) {
      return 'NEGATIVE_ACCELERATION';
    }

    return 'NEUTRAL_ACCELERATION';
  }
}
