import { QueryPerformanceMetric } from './ProfilingTypes';

export class QueryPerformanceTracker {
  private static metrics: QueryPerformanceMetric[] = [];

  static recordQuery(
    collection: string, 
    durationMs: number, 
    returnedDocs: number, 
    tenantId: string, 
    workspaceId: string,
    isCached: boolean = false
  ) {
    const metric: QueryPerformanceMetric = {
      queryId: `Q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      collection,
      durationMs,
      returnedDocs,
      tenantId,
      workspaceId,
      timestamp: new Date().toISOString(),
      isCached
    };

    this.metrics.push(metric);
    
    if (durationMs > 1000) {
      console.warn(`[QueryPerformanceTracker] Query LENTA detectada em ${collection}: ${durationMs.toFixed(2)}ms para ${returnedDocs} docs.`);
    }

    // Keep memory clean
    if (this.metrics.length > 500) {
      this.metrics.shift();
    }
  }

  static getMetrics(): QueryPerformanceMetric[] {
    return [...this.metrics];
  }

  static clear() {
    this.metrics = [];
  }
}
