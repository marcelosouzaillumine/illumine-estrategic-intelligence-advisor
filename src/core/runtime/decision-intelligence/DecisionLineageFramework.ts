import { ExecutiveDecisionObject } from './ExecutiveDecisionObject';

export class DecisionLineageFramework {
  public static validate(decision: ExecutiveDecisionObject): {
    status: 'VALID' | 'DECISION_WITHOUT_LINEAGE';
    reason?: string;
  } {
    if (!decision.lineageReferences || decision.lineageReferences.length === 0) {
      return {
        status: 'DECISION_WITHOUT_LINEAGE',
        reason: 'A decision must trace back to evidence/indicators.'
      };
    }
    return { status: 'VALID' };
  }
}
