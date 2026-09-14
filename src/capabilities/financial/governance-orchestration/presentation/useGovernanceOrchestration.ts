import { useState, useCallback } from 'react';
import { FiduciaryRuntimeAdapter } from '../../../../services/FiduciaryRuntimeAdapter';
import type { RecommendationEvidence } from '../../../../workspace/runtime/governance-orchestration/GovernanceOrchestrationTypes';

export function useGovernanceOrchestration(tenantId: string) {
  const [, setTick] = useState(0);
  const engine = FiduciaryRuntimeAdapter.InstitutionalOrchestrationEngine;

  const coordination = engine.getActiveCoordination(tenantId);

  const coordinate = useCallback((playbookId: string, initialEvidence: RecommendationEvidence) => {
    const result = engine.coordinate(tenantId, playbookId, initialEvidence);
    setTick(t => t + 1);
    return result;
  }, [tenantId, engine]);

  const clearSandbox = useCallback(() => {
    const result = engine.clearSandbox(tenantId);
    setTick(t => t + 1);
    return result;
  }, [tenantId, engine]);

  return {
    coordination,
    coordinate,
    clearSandbox
  };
}
