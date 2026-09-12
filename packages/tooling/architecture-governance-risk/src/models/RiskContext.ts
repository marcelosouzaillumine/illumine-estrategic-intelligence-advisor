import { ArchitectureSignal } from '@illumine/architecture-governance-advisory';

export interface RiskContext {
  readonly id: string;
  readonly targetSubject: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly advisorySignals: readonly ArchitectureSignal[];
}
