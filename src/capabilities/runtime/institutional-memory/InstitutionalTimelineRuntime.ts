import { InstitutionalDecisionLedger, LedgerEvent } from './InstitutionalDecisionLedger';

export interface TimelineMilestone {
  year: number;
  label: string;
  significance: 'CRITICAL' | 'MILESTONE' | 'ROUTINE';
}

export class InstitutionalTimelineRuntime {
  /**
   * Generates a chronologically sorted timeline of significant institutional milestones.
   */
  public static generate(ledger: InstitutionalDecisionLedger): TimelineMilestone[] {
    const events = ledger.getEvents();
    
    // Group events by fiscalYear
    const yearMap = new Map<number, LedgerEvent[]>();
    for (const e of events) {
      if (!e.fiscalYear) continue;
      if (!yearMap.has(e.fiscalYear)) yearMap.set(e.fiscalYear, []);
      yearMap.get(e.fiscalYear)!.push(e);
    }

    const timeline: TimelineMilestone[] = [];
    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);

    for (const year of sortedYears) {
      const yearEvents = yearMap.get(year)!;
      const criticals = yearEvents.filter(e => e.severity === 'CRITICAL');
      const improvements = yearEvents.filter(e => e.eventType === 'STRUCTURAL_IMPROVEMENT');

      if (criticals.length > 0) {
        timeline.push({
          year,
          label: `Identificação de ${criticals.length} riscos estruturais críticos.`,
          significance: 'CRITICAL'
        });
      } else if (improvements.length > 0) {
        timeline.push({
          year,
          label: `Marco de evolução fiduciária validado.`,
          significance: 'MILESTONE'
        });
      } else {
        timeline.push({
          year,
          label: `Encerramento de ciclo operacional padrão.`,
          significance: 'ROUTINE'
        });
      }
    }

    return timeline;
  }
}
