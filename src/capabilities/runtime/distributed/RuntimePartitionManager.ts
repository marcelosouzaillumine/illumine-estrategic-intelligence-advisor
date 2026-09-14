import { DataAccessContext } from '../../../core/security/data-access-context';

export type RuntimePartitionType =
  | 'Advisory Runtime'
  | 'Simulation Runtime'
  | 'Telemetry Runtime'
  | 'Observability Runtime'
  | 'Reporting Runtime'
  | 'Governance Runtime'
  | 'Background Jobs Runtime'
  | 'Export Runtime'
  | 'Replay Runtime'
  | 'Anomaly Detection Runtime';

export interface PartitionMetrics {
  healthState: 'HEALTHY' | 'CONGESTED' | 'DEGRADED';
  averageLatency: number;
  throughput: number;
  failures: number;
  retryRate: number;
  queueDepth: number;
  pressureLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class RuntimePartitionManager {
  private static metrics: Record<RuntimePartitionType, PartitionMetrics> = {
    'Advisory Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Simulation Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Telemetry Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Observability Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Reporting Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Governance Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Background Jobs Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Export Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Replay Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' },
    'Anomaly Detection Runtime': { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' }
  };

  private static latencyHistory: Record<RuntimePartitionType, number[]> = {
    'Advisory Runtime': [],
    'Simulation Runtime': [],
    'Telemetry Runtime': [],
    'Observability Runtime': [],
    'Reporting Runtime': [],
    'Governance Runtime': [],
    'Background Jobs Runtime': [],
    'Export Runtime': [],
    'Replay Runtime': [],
    'Anomaly Detection Runtime': []
  };

  private static executionTimestamps: Record<RuntimePartitionType, number[]> = {
    'Advisory Runtime': [],
    'Simulation Runtime': [],
    'Telemetry Runtime': [],
    'Observability Runtime': [],
    'Reporting Runtime': [],
    'Governance Runtime': [],
    'Background Jobs Runtime': [],
    'Export Runtime': [],
    'Replay Runtime': [],
    'Anomaly Detection Runtime': []
  };

  static registerExecution(partition: RuntimePartitionType, latencyMs: number, failed: boolean = false, isRetry: boolean = false) {
    const history = this.latencyHistory[partition];
    history.push(latencyMs);
    if (history.length > 50) history.shift();
    this.metrics[partition].averageLatency = Math.round(history.reduce((a, b) => a + b, 0) / history.length);

    const now = Date.now();
    const timestamps = this.executionTimestamps[partition];
    timestamps.push(now);
    this.executionTimestamps[partition] = timestamps.filter(t => now - t < 60000);
    this.metrics[partition].throughput = this.executionTimestamps[partition].length;

    if (failed) {
      this.metrics[partition].failures++;
    }
    if (isRetry) {
      this.metrics[partition].retryRate++;
    }

    this.recalculateHealthAndPressure(partition);
  }

  static updateQueueDepth(partition: RuntimePartitionType, depth: number) {
    this.metrics[partition].queueDepth = depth;
    this.recalculateHealthAndPressure(partition);
  }

  private static recalculateHealthAndPressure(partition: RuntimePartitionType) {
    const met = this.metrics[partition];
    
    if (met.queueDepth > 25 || met.averageLatency > 1000) {
      met.pressureLevel = 'CRITICAL';
      met.healthState = 'DEGRADED';
    } else if (met.queueDepth > 10 || met.averageLatency > 500 || met.throughput > 80) {
      met.pressureLevel = 'HIGH';
      met.healthState = 'CONGESTED';
    } else if (met.queueDepth > 3 || met.averageLatency > 200 || met.throughput > 30) {
      met.pressureLevel = 'MEDIUM';
      met.healthState = 'HEALTHY';
    } else {
      met.pressureLevel = 'LOW';
      met.healthState = 'HEALTHY';
    }
  }

  static getMetrics(): Record<RuntimePartitionType, PartitionMetrics> {
    return { ...this.metrics };
  }

  static getPartitionMetrics(partition: RuntimePartitionType): PartitionMetrics {
    return { ...this.metrics[partition] };
  }

  static reset() {
    for (const key of Object.keys(this.metrics)) {
      const part = key as RuntimePartitionType;
      this.metrics[part] = { healthState: 'HEALTHY', averageLatency: 0, throughput: 0, failures: 0, retryRate: 0, queueDepth: 0, pressureLevel: 'LOW' };
      this.latencyHistory[part] = [];
      this.executionTimestamps[part] = [];
    }
  }
}
