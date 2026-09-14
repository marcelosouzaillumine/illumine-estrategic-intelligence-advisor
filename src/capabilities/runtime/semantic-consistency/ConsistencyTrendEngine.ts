export interface ConsistencyDataPoint {
  month: string;
  score: number;
}

export enum ConsistencyTrend {
  IMPROVING = 'IMPROVING',
  STABLE = 'STABLE',
  DETERIORATING = 'DETERIORATING'
}

export class ConsistencyTrendEngine {
  /**
   * Avalia se a coerência entre motores melhora ao longo do tempo.
   */
  public static evaluateTrend(history: ConsistencyDataPoint[]): ConsistencyTrend {
    if (!history || history.length < 2) return ConsistencyTrend.STABLE;

    const first = history[0].score;
    const last = history[history.length - 1].score;

    const diff = last - first;

    if (diff > 5) return ConsistencyTrend.IMPROVING;
    if (diff < -5) return ConsistencyTrend.DETERIORATING;
    return ConsistencyTrend.STABLE;
  }
}
