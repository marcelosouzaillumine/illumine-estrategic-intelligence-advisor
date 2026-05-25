import { ConsolidatedViolation } from './consolidated-types';

export function propagateViolations(
  entityViolations: Record<string, ConsolidatedViolation[]>
): ConsolidatedViolation[] {
  
  const propagated: ConsolidatedViolation[] = [];

  for (const [entityId, violations] of Object.entries(entityViolations)) {
    for (const v of violations) {
      // In a full implementation, we would check if the violation has cross-default clauses
      // For now, we propagate all WARNING and CRITICAL violations to the group level
      if (v.severity === 'WARNING' || v.severity === 'CRITICAL' || v.severity === 'DEFAULT') {
        propagated.push({
          ...v,
          sourceEntityId: entityId,
          propagatedToGroup: true
        });
      }
    }
  }

  return propagated;
}
