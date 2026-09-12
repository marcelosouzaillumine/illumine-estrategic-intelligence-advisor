import { RuntimePerformanceMetrics } from './observability-types';
import { CalibrationEngine } from '../../core/runtime/calibration/CalibrationEngine';

export class RuntimeProfiler {
  private startTime: number;
  private endTime: number = 0;
  private engineStartTimes: Map<string, number> = new Map();
  private engineDurations: Record<string, number> = {};
  private warnings: string[] = [];

  constructor() {
    this.startTime = Date.now();
  }

  public startEngine(engineName: string) {
    this.engineStartTimes.set(engineName, Date.now());
  }

  public endEngine(engineName: string) {
    const start = this.engineStartTimes.get(engineName);
    if (start) {
      const duration = Date.now() - start;
      this.engineDurations[engineName] = (this.engineDurations[engineName] || 0) + duration;
      
      const excessiveThreshold = CalibrationEngine.getCalibration().degradedModeThresholdMs;
      const criticalThreshold = excessiveThreshold * 2;

      if (duration > criticalThreshold) {
        this.warnings.push(`Engine ${engineName} exceeded critical execution time (${duration}ms)`);
      } else if (duration > excessiveThreshold) {
        this.warnings.push(`Engine ${engineName} exceeded excessive execution time (${duration}ms)`);
      }
    }
  }

  public addWarning(warning: string) {
    this.warnings.push(warning);
  }

  public stop() {
    this.endTime = Date.now();
  }

  public getMetrics(): RuntimePerformanceMetrics {
    const totalTime = (this.endTime || Date.now()) - this.startTime;
    
    let memoryUsageBytes: number | undefined;
    if (typeof process !== 'undefined' && process.memoryUsage) {
      memoryUsageBytes = process.memoryUsage().heapUsed;
    } else {
      // Fallback estimative
      memoryUsageBytes = 5 * 1024 * 1024; // 5MB mock estimate
    }

    return {
      totalExecutionTimeMs: totalTime,
      engineExecutionTimes: this.engineDurations,
      memoryUsageBytes,
      isDegradedMode: this.warnings.length >= 3,
      warnings: this.warnings
    };
  }
}
