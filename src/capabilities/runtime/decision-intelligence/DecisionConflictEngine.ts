import { ExecutiveDecisionObject } from './ExecutiveDecisionObject';
import { ConstitutionalActionRegistry } from './ConstitutionalActionRegistry';

export class DecisionConflictEngine {
  public static validate(decisions: ExecutiveDecisionObject[]): {
    status: 'VALID' | 'DECISION_CONFLICT_DETECTED';
    conflicts?: string[];
  } {
    const actionIds = decisions.map(d => d.actionId);
    const conflicts: string[] = [];

    for (const decision of decisions) {
      const action = ConstitutionalActionRegistry.getAction(decision.actionId);
      if (action && action.conflictsWith) {
        for (const conflict of action.conflictsWith) {
          if (actionIds.includes(conflict)) {
            conflicts.push(`Conflict: ${decision.actionId} conflicts with ${conflict}`);
          }
        }
      }
    }

    if (conflicts.length > 0) {
      return {
        status: 'DECISION_CONFLICT_DETECTED',
        conflicts
      };
    }

    return { status: 'VALID' };
  }
}
