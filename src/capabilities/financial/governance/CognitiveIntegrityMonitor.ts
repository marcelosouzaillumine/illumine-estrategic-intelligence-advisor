export interface CognitiveResult {
  passed: boolean;
  violations: string[];
}

export function monitorCognitiveIntegrity(runtimeOutput: any): CognitiveResult {
  const violations: string[] = [];

  if (!runtimeOutput || !runtimeOutput.globalConfidence) {
    violations.push('Propagação de confidence global falhou. Objeto raiz não possui globalConfidence.');
    return { passed: false, violations };
  }

  // Verifica se as violations internas estão sendo propagadas
  let totalViolations = 0;
  for (const engine in runtimeOutput.inferences) {
    const inference = runtimeOutput.inferences[engine];
    if (inference.violations && inference.violations.length > 0) {
       totalViolations += inference.violations.length;
    }
  }

  if (totalViolations > 0 && (!runtimeOutput.violations || runtimeOutput.violations.length !== totalViolations)) {
    violations.push(`Perda de violations detectada na orquestração. Motores reportaram ${totalViolations}, mas o output consolidado reportou ${runtimeOutput.violations?.length || 0}.`);
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
