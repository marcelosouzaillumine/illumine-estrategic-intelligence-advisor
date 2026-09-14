import { ArchitectureSignal } from './ArchitectureSignal';
import { ArchitectureNarrative } from './ArchitectureNarrative';

export interface AdvisorySnapshot {
  readonly version: string;
  readonly targetSubject: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly signals: readonly ArchitectureSignal[];
  readonly narratives: readonly ArchitectureNarrative[];
  readonly generatedBy: {
    readonly engineVersion: string;
    readonly timestamp: string;
  };
}
