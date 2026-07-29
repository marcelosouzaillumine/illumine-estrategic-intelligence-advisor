export interface ProductUsageMetrics {
  totalPageViews: number;
  averageSessionDurationMinutes: number;
  weeklyRetentionPercentage: number;
  mostVisitedFeature: string;
}

export class ProductAnalyticsEngine {
  public static getUsageMetrics(): ProductUsageMetrics {
    return {
      totalPageViews: 4281,
      averageSessionDurationMinutes: 8.0,
      weeklyRetentionPercentage: 92.0,
      mostVisitedFeature: 'Executive Narrative'
    };
  }
}
