export interface DecisionLineage {
  readonly observationId: string;
  readonly evidenceId: string;
  readonly hypothesisId: string;
  readonly verdictId: string;
  readonly architectureDecisionId: string;
  readonly approvedChangeId?: string;
  readonly implementationWaveId?: string;
  readonly certificationId?: string;
  readonly observedResultId?: string;
  readonly futureObservationId?: string;
}
