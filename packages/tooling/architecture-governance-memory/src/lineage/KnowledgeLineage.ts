export interface KnowledgeLineage {
  readonly observationId: string;
  readonly measurementId?: string;
  readonly certificationId?: string;
  readonly insightId?: string;
  readonly decisionId?: string;
  readonly implementationEventId?: string;
  readonly architecturalStateId?: string;
  readonly futureObservationId?: string;
}
