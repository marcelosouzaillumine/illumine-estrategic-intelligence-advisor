export interface ArchitectureObservation {
  readonly id: string;
  readonly metric: string;
  readonly before: number | string;
  readonly after: number | string;
  readonly timestamp: string;
}
