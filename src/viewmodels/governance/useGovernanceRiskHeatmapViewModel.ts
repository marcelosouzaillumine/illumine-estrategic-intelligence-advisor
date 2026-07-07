import { useState, useEffect } from 'react';
import { FiduciaryRuntimeAdapter } from '../../services/FiduciaryRuntimeAdapter';
import type { RiskHeatmap } from '../../services/FiduciaryRuntimeAdapter';

export function useGovernanceRiskHeatmapViewModel() {
  const [heatmapData, setHeatmapData] = useState<RiskHeatmap | null>(null);

  useEffect(() => {
    // Em produção, o tenantId viria do TenantExecutionContext do usuário logado.
    const data = FiduciaryRuntimeAdapter.enterpriseRiskEngine.generateHeatmap('current-tenant-id');
    setHeatmapData(data);
  }, []);

  return {
    state: {
      heatmapData,
    },
    computed: {},
    actions: {},
  };
}
