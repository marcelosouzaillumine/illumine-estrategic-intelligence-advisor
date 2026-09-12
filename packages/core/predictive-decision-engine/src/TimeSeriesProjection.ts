export class TimeSeriesProjection {
  public static projectNextPeriod(series: readonly number[], stepsAhead: number = 1): readonly number[] {
    if (series.length === 0) return [0];
    const lastValue = series[series.length - 1];
    const projected: number[] = [];

    for (let i = 1; i <= stepsAhead; i++) {
      projected.push(Number((lastValue * (1 + 0.01 * i)).toFixed(2)));
    }

    return projected;
  }
}
