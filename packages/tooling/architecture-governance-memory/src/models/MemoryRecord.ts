export interface MemoryRecord {
  readonly id: string;
  readonly eventType: 'DECISION' | 'ARCHITECTURAL_CHANGE' | 'CERTIFICATION' | 'OBSERVATION';
  readonly sourceReferences: readonly string[]; // IDs to origin facts
  readonly previousState?: string;
  readonly resultingState?: string;
  readonly observedOutcome?: string;
  readonly timestamp: string;
}
