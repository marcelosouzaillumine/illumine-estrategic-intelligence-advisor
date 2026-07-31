import { EvolutionEvent } from './EvolutionEvent';

export type SubjectType = 'CAPABILITY' | 'PACKAGE' | 'DOMAIN' | 'ARTIFACT';

export interface ArchitectureTrajectory {
  readonly id: string;
  readonly subjectId: string;
  readonly subjectType: SubjectType;
  readonly events: readonly EvolutionEvent[];
}
