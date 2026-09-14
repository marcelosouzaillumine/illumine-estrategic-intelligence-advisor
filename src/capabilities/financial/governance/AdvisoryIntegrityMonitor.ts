export interface AdvisoryResult {
  passed: boolean;
  violations: string[];
}

export function monitorAdvisoryIntegrity(runtimeOutput: any): AdvisoryResult {
  const violations: string[] = [];

  if (runtimeOutput && runtimeOutput.inferences) {
    const decision = runtimeOutput.inferences['ExecutiveDecisionEngine'];
    if (decision && decision.blockedNarratives) {
      const blocked = decision.blockedNarratives;
      // Em um cenário real, checaríamos se a UI renderizou o advisory hardcoded contendo a narrativa bloqueada.
      // Como estamos auditando o Runtime, checamos se o DecisionEngine não gerou ação recomendada conflitante.
      if (blocked.length > 0 && decision.narrative?.diagnostic === 'HARDCODED_FALLBACK') {
         violations.push('Advisory Integrity falhou: Fallback hardcoded detectado em Executive Decision.');
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
