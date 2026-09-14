export interface ConfidenceResult {
  passed: boolean;
  violations: string[];
}

export function validateConfidenceIntegrity(runtimeOutput: any): ConfidenceResult {
  const violations: string[] = [];

  if (runtimeOutput && runtimeOutput.inferences) {
    const memory = runtimeOutput.inferences['InstitutionalMemoryEngine'];
    if (memory && memory.metrics) {
      if (memory.metrics.periodsAvailable < 3 && memory.confidence !== 'LOW') {
        violations.push(`Confidence Integrity falhou: Menos de 3 períodos detectados mas confidence não é LOW. Recebido: ${memory.confidence}`);
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
