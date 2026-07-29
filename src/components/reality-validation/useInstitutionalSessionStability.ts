import { useMemo } from 'react';
import { InstitutionalSessionStabilityEngine } from '../../services/FiduciaryRuntimeAdapter';

export function useInstitutionalSessionStability(tenantId: string, observationWindowSeconds: number = 120) {
  const report = useMemo(() => {
    return InstitutionalSessionStabilityEngine.evaluate(tenantId, observationWindowSeconds);
  }, [tenantId, observationWindowSeconds]);

  return report;
}
