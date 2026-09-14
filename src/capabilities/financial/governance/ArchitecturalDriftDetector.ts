export interface DriftResult {
  passed: boolean;
  violations: string[];
}

export function detectArchitecturalDrift(runtimeOutput: any): DriftResult {
  const violations: string[] = [];
  
  const expectedEngines = [
    'LegacyFinancialAdapter',
    'LegacyDREAdapter',
    'LegacyDFCAdapter',
    'StressTestAdapter',
    'ExecutiveDecisionEngine',
    'InstitutionalMemoryEngine'
  ];

  if (runtimeOutput && runtimeOutput.executedEngines) {
    const executed = runtimeOutput.executedEngines;
    expectedEngines.forEach(engine => {
      if (!executed.includes(engine)) {
        violations.push(`Engine obrigatória faltante no RuntimeOrchestrator: ${engine}. Risco de drift arquitetural.`);
      }
    });
  } else {
    violations.push('Propriedade executedEngines não encontrada no RuntimeOutput.');
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
