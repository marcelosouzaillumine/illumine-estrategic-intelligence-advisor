import { useState, useCallback } from 'react';
import { ProductGovernanceEngine, QuotaId, FeatureId } from '../../../../services/FiduciaryRuntimeAdapter';

export function useProductGovernance(tenantId: string) {
  const [, setTick] = useState(0);

  const getQuotaStatus = useCallback((quotaId: QuotaId) => {
    return ProductGovernanceEngine.getQuotaStatus(tenantId, quotaId);
  }, [tenantId]);

  const requestQuotaConsumption = useCallback((quotaId: QuotaId, amount: number) => {
    const result = ProductGovernanceEngine.requestQuotaConsumption(tenantId, quotaId, amount);
    setTick(t => t + 1);
    return result;
  }, [tenantId]);

  const requestFeatureAccess = useCallback((featureId: FeatureId) => {
    return ProductGovernanceEngine.requestFeatureAccess(tenantId, featureId);
  }, [tenantId]);

  return {
    getQuotaStatus,
    requestQuotaConsumption,
    requestFeatureAccess
  };
}
