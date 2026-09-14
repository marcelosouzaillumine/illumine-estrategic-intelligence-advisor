export interface HistoricalResult {
  passed: boolean;
  violations: string[];
}

export function validateHistoricalConsistency(runtimeOutput: any): HistoricalResult {
  const violations: string[] = [];

  if (runtimeOutput && runtimeOutput.inferences) {
    const memory = runtimeOutput.inferences['InstitutionalMemoryEngine'];
    if (memory && memory.metrics) {
      if (memory.metrics.periodsAvailable >= 2 && memory.metrics.periodsAvailable < 3) {
        if (memory.metrics.memoryType !== 'LIMITED_COMPARISON' && memory.metrics.memoryType !== 'BLOCKED_INSUFFICIENT_HISTORY') {
          violations.push('Historical Consistency falhou: memoryType para 2 períodos deve ser LIMITED_COMPARISON.');
        }
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
