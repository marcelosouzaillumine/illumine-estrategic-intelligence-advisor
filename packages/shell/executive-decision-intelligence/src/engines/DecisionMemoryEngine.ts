import { InstitutionalDecisionMemory, DecisionMemoryState, DecisionLesson } from '../models/InstitutionalDecisionMemory';

export class DecisionMemoryEngine {
  createMemory(decisionId: string, tenantId: string): InstitutionalDecisionMemory {
    return {
      decisionId,
      currentState: 'DECISION_CREATED',
      history: [
        {
          state: 'DECISION_CREATED',
          timestamp: new Date().toISOString()
        }
      ],
      lessonsGenerated: [],
      tenantId
    };
  }

  transitionState(memory: InstitutionalDecisionMemory, newState: DecisionMemoryState): InstitutionalDecisionMemory {
    return {
      ...memory,
      currentState: newState,
      history: [
        ...memory.history,
        {
          state: newState,
          timestamp: new Date().toISOString()
        }
      ]
    };
  }

  generateLesson(memory: InstitutionalDecisionMemory, lesson: DecisionLesson): InstitutionalDecisionMemory {
    return {
      ...memory,
      lessonsGenerated: [...memory.lessonsGenerated, lesson]
    };
  }
}
