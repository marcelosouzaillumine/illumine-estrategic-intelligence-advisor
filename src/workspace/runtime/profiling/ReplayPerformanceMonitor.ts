export class ReplayPerformanceMonitor {
  private static replayDurations: number[] = [];

  static recordReplayLoadTime(executionId: string, durationMs: number) {
    this.replayDurations.push(durationMs);
    
    if (durationMs > 1000) {
      console.warn(`[ReplayPerformanceMonitor] Execução ${executionId} demorou ${durationMs.toFixed(2)}ms para remontar o Snapshot. Possível saturação.`);
    }

    if (this.replayDurations.length > 100) {
      this.replayDurations.shift();
    }
  }

  static getAverageLoadTime(): number {
    if (this.replayDurations.length === 0) return 0;
    const sum = this.replayDurations.reduce((a, b) => a + b, 0);
    return sum / this.replayDurations.length;
  }
}
