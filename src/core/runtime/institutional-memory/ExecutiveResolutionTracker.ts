import { InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';

export type ResolutionStatus = 'RESOLVIDO' | 'PERSISTENTE' | 'AGRAVADO' | 'RECORRENTE' | 'DESLOCADO' | 'INCONCLUSIVO';

export interface ResolutionTracking {
  issueId: string;
  issueName: string;
  status: ResolutionStatus;
  narrative: string;
}

export class ExecutiveResolutionTracker {
  /**
   * Tracks whether historical issues have been resolved or just shifted.
   */
  public static track(ledger: InstitutionalDecisionLedger, currentIssues: string[]): ResolutionTracking[] {
    const events = ledger.getEventsByDomain('issue_tracking');
    const trackingMap = new Map<string, ResolutionTracking>();

    // For simplicity of this mock runtime, assume events contain status updates
    for (const e of events) {
      const isStillPresent = currentIssues.includes(e.eventType);
      let status: ResolutionStatus = 'INCONCLUSIVO';
      let narrative = 'Status não determinado.';

      if (e.severity === 'CRITICAL' && isStillPresent) {
        status = 'AGRAVADO';
        narrative = `O risco estrutural de ${e.eventType} piorou e exige intervenção.`;
      } else if (isStillPresent) {
        status = 'PERSISTENTE';
        narrative = `O problema de ${e.eventType} permanece sem resolução.`;
      } else if (!isStillPresent && e.severity === 'RESOLVED') {
        status = 'RESOLVIDO';
        narrative = `A questão de ${e.eventType} foi mitigada com sucesso.`;
      } else if (!isStillPresent) {
        // If it's not present now, but wasn't formally resolved, it might have shifted
        status = 'DESLOCADO';
        narrative = `O problema de ${e.eventType} sumiu temporariamente, mas não há evidência de resolução estrutural (pode ter sido deslocado).`;
      }

      trackingMap.set(e.eventType, {
        issueId: e.eventId,
        issueName: e.eventType,
        status,
        narrative
      });
    }

    return Array.from(trackingMap.values());
  }
}
