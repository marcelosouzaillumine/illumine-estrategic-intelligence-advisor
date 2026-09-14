import { ArchitectureObservation } from './ArchitectureObservation';

export interface AdvisoryContext {
  readonly id: string;
  readonly targetSubject: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly observations: readonly ArchitectureObservation[];
}
