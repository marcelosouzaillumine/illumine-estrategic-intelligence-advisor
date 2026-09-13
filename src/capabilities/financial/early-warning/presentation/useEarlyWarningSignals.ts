import { useState, useCallback } from 'react';
import { EarlyWarningSignalEngine } from '../../../../services/FiduciaryRuntimeAdapter';

export function useEarlyWarningSignals(tenantId: string) {
  const [, setTick] = useState(0);

  const signals = EarlyWarningSignalEngine.getSignals(tenantId);

  const executeDetection = useCallback(() => {
    const result = EarlyWarningSignalEngine.executeDetection(tenantId);
    setTick(t => t + 1);
    return result;
  }, [tenantId]);

  const clearSignals = useCallback(() => {
    EarlyWarningSignalEngine.clearSignals(tenantId);
    setTick(t => t + 1);
  }, [tenantId]);

  return {
    signals,
    executeDetection,
    clearSignals
  };
}
