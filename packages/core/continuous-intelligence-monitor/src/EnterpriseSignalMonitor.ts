import { Identifier } from '@illumine/core-primitives';
import { CorporateDimensionType } from '@illumine/semantic-model';

export type SignalSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EnterpriseSignalEvent {
  readonly signalId: Identifier;
  readonly domain: CorporateDimensionType;
  readonly metric: string;
  readonly previousValue: number;
  readonly currentValue: number;
  readonly variation: number;
  readonly severity: SignalSeverity;
  readonly businessImpact: string;
  readonly timestamp: Date;
}

export class EnterpriseSignalMonitor {
  private readonly capturedSignals: EnterpriseSignalEvent[] = [];

  public emitSignal(signal: EnterpriseSignalEvent): void {
    this.capturedSignals.push(signal);
  }

  public getSignalsByDomain(domain: CorporateDimensionType): readonly EnterpriseSignalEvent[] {
    return this.capturedSignals.filter(s => s.domain === domain);
  }

  public getAllSignals(): readonly EnterpriseSignalEvent[] {
    return this.capturedSignals;
  }
}
