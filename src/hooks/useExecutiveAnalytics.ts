import { useState, useEffect } from 'react';
import { BalanceSheetCapability } from '../../packages/shell/executive-analytics-engine/capabilities/BalanceSheetCapability';
import { ExecutiveAnalyticsResult } from '../../packages/shell/executive-analytics-engine';

// Mock registry mapping capability string names to instances
const capabilityRegistry: Record<string, any> = {
  'BalanceSheetCapability': new BalanceSheetCapability()
};

export function useExecutiveAnalytics(tenantId: string, capabilityName: string, contextData: any) {
  const [result, setResult] = useState<ExecutiveAnalyticsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function evaluate() {
      setLoading(true);
      try {
        const capability = capabilityRegistry[capabilityName];
        if (!capability) throw new Error(`Capability ${capabilityName} not found in registry.`);
        
        // Simulating async capability evaluation 
        const res = capability.evaluate({
          tenantId,
          period: 'CURRENT',
          snapshotId: `snap-${Date.now()}`,
          financialData: contextData
        });

        setResult(res);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    evaluate();
  }, [tenantId, capabilityName, contextData]);

  return { result, loading, error };
}
