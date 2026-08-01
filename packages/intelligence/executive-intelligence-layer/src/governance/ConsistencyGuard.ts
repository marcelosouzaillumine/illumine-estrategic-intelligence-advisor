import { ExecutiveDiagnosis } from '../contracts/ExecutiveDiagnosis';

export class ConsistencyGuard {
  /**
   * Última linha de defesa antes da renderização/montagem final.
   * Assegura que o diagnóstico não contém contradições óbvias.
   */
  public static checkConsistency(diagnosis: ExecutiveDiagnosis): string[] {
    const consistencyErrors: string[] = [];

    if (diagnosis.financialState.status === 'CRITICAL' && diagnosis.decisionMode !== 'PRESERVE') {
      consistencyErrors.push(`INCONSISTENCY: State is CRITICAL but Decision Mode is ${diagnosis.decisionMode}. Must be PRESERVE.`);
    }

    if (diagnosis.financialState.evidenceIntegrity === 'REJECTED' && diagnosis.primaryDriver === 'GROWTH') {
      consistencyErrors.push(`INCONSISTENCY: Evidence rejected, but primary driver is GROWTH.`);
    }

    // Validação de bloqueios vs ações recomendadas
    diagnosis.recommendations.forEach(rec => {
      if (diagnosis.blockedActions.some(blocked => rec.action.toLowerCase().includes(blocked.toLowerCase()))) {
        consistencyErrors.push(`INCONSISTENCY: Recommended action '${rec.action}' violates blocked action policy.`);
      }
    });

    return consistencyErrors;
  }
}
