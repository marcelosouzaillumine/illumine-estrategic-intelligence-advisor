export interface StressResult {
  passed: boolean;
  violations: string[];
}

export function validateStressConsistency(runtimeOutput: any): StressResult {
  const violations: string[] = [];

  if (runtimeOutput && runtimeOutput.inferences) {
    const stress = runtimeOutput.inferences['StressTestAdapter'];
    const dfc = runtimeOutput.inferences['LegacyDFCAdapter'];
    
    if (stress && (!dfc || dfc.evidenceLevel === 'INFERRED_LOW_CONFIDENCE')) {
       // Se o stress está rodando, ele deveria estar bloqueado ou emitir violation se o DFC for fraco.
       if (stress.confidence !== 'LOW' && stress.metrics?.status !== 'BLOCKED') {
          violations.push('Stress Consistency falhou: Stress Engine executado com alto confidence sem DFC certificado válido.');
       }
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
