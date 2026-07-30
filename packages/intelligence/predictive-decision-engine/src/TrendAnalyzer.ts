export class TrendAnalyzer {
  public static analyzeTrend(series: readonly number[]): { readonly trend: 'UPWARD' | 'DOWNWARD' | 'STABLE'; readonly slope: number } {
    if (series.length < 2) return { trend: 'STABLE', slope: 0 };
    const first = series[0];
    const last = series[series.length - 1];
    const slope = Number((last - first).toFixed(2));

    return {
      trend: slope > 0 ? 'UPWARD' : slope < 0 ? 'DOWNWARD' : 'STABLE',
      slope
    };
  }
}
