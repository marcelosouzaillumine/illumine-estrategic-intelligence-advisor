export interface ViolationResult {
  passed: boolean;
  violations: string[];
}

export function watchRuntimeViolations(runtimeOutput: any): ViolationResult {
  const violations: string[] = [];

  if (runtimeOutput && runtimeOutput.violations) {
    const criticals = runtimeOutput.violations.filter((v: any) => v.severity === 'CRITICAL');
    if (criticals.length > 0 && runtimeOutput.executionStatus !== 'FAILED' && runtimeOutput.executionStatus !== 'COMPLETED_WITH_VIOLATIONS') {
      violations.push('Violations críticas detectadas, mas o status de execução não reflete bloqueio (executionStatus inválido).');
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
