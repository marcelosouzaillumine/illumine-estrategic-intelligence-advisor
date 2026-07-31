export type DecisionMemoryState = 
  | 'DECISION_CREATED' 
  | 'DECISION_APPROVED' 
  | 'EXECUTION_INITIATED' 
  | 'RESULT_OBSERVED' 
  | 'OUTCOME_COMPARED' 
  | 'LESSON_GENERATED' 
  | 'INTELLIGENCE_UPDATED';

export interface DecisionLesson {
  readonly expectedOutcome: string;
  readonly observedResult: string;
  readonly lessonLearned: string;
  readonly date: string;
}

export interface InstitutionalDecisionMemory {
  readonly decisionId: string;
  readonly currentState: DecisionMemoryState;
  readonly history: readonly {
    readonly state: DecisionMemoryState;
    readonly timestamp: string;
  }[];
  readonly executionContext?: string;
  readonly lessonsGenerated: readonly DecisionLesson[];
  readonly tenantId: string; // Used for tenant isolation (DEC-005)
}
