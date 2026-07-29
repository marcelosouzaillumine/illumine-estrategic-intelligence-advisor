export interface PlatformMetrics {
  cpuUsagePercentage: number;
  memoryUsageMb: number;
  averageLatencyMs: number;
  throughputRps: number;
  errorRatePercentage: number;
}

export class MetricCollector {
  public static getMetrics(): PlatformMetrics {
    return {
      cpuUsagePercentage: 12.4,
      memoryUsageMb: 248.5,
      averageLatencyMs: 8.2,
      throughputRps: 1450,
      errorRatePercentage: 0.01
    };
  }
}
