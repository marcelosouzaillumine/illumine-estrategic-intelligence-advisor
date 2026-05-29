export type LedgerEventSource = 'runtime' | 'manual' | 'system';

export interface LedgerEvent {
  eventId: string; // Unique ID for the event
  cycleId: string;
  fiscalYear?: number;
  eventType: string;
  domain: string;
  severity: string;
  evidence: string[];
  createdAt: string;
  source: LedgerEventSource;
}

export class InstitutionalDecisionLedger {
  private readonly events: LedgerEvent[] = [];

  constructor(initialEvents: LedgerEvent[] = []) {
    this.events = [...initialEvents].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  /**
   * Append-only implementation. Mutations are strictly prohibited.
   */
  public appendEvent(event: Omit<LedgerEvent, 'eventId' | 'createdAt'>): void {
    const newEvent: LedgerEvent = {
      ...event,
      eventId: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    // Push is the only write operation allowed
    this.events.push(newEvent);
  }

  /**
   * Returns a deeply cloned, immutable array of events to prevent accidental modifications by callers.
   */
  public getEvents(): ReadonlyArray<Readonly<LedgerEvent>> {
    return Object.freeze(this.events.map(e => Object.freeze({ ...e })));
  }

  /**
   * Helper to retrieve all events by domain.
   */
  public getEventsByDomain(domain: string): ReadonlyArray<Readonly<LedgerEvent>> {
    return this.getEvents().filter(e => e.domain === domain);
  }

  /**
   * Helper to retrieve events specific to a fiscal cycle.
   */
  public getEventsByFiscalYear(year: number): ReadonlyArray<Readonly<LedgerEvent>> {
    return this.getEvents().filter(e => e.fiscalYear === year);
  }
}
