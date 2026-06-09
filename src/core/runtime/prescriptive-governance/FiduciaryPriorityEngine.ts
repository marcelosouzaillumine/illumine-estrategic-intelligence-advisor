import { ExecutivePriority, InstitutionalCapacity } from './PrescriptiveTypes';

export class FiduciaryPriorityEngine {
  static prioritize(actions: ExecutivePriority[], capacity: InstitutionalCapacity): ExecutivePriority[] {
    if (actions.length === 0) return [];

    // 1. Calculate Priority Score based on Urgency and Impact
    const scoredActions = actions.map(action => {
      let score = 0;

      if (action.urgency === 'CRITICAL') score += 40;
      else if (action.urgency === 'HIGH') score += 30;
      else if (action.urgency === 'MODERATE') score += 15;
      else score += 5;

      if (action.impact === 'SYSTEMIC') score += 40;
      else if (action.impact === 'SIGNIFICANT') score += 30;
      else if (action.impact === 'MODERATE') score += 15;
      else score += 5;

      // Bonus for high confidence
      if (action.confidenceLevel === 'HIGH') score += 20;
      else if (action.confidenceLevel === 'MODERATE') score += 10;

      // Determine Fiduciary Reason
      let reason = 'Alinhamento fiduciário padrão.';
      if (action.urgency === 'CRITICAL' && action.impact === 'SYSTEMIC') {
        reason = 'Ameaça sistêmica iminente. Exige deliberação imediata do Board.';
      } else if (action.urgency === 'HIGH' || action.impact === 'SIGNIFICANT') {
        reason = 'Risco material à continuidade dos negócios.';
      }

      return {
        ...action,
        priorityScore: Math.min(100, score),
        priorityReason: reason
      };
    });

    // 2. Sort by Score descending
    scoredActions.sort((a, b) => b.priorityScore - a.priorityScore);

    // 3. Assign Rank and filter by Capacity limit
    const rankedActions = scoredActions.map((action, index) => ({
      ...action,
      priorityRank: index + 1
    }));

    return rankedActions.slice(0, capacity.maxConcurrentInterventions);
  }
}
