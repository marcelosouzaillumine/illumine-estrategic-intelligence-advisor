import { useState } from 'react';
import { useSensitivityAnalysisAdapter } from '../adapters/ui/useSensitivityAnalysisAdapter.ts';

export function useSensitivityAnalysisViewModel({ clientId }: any) {
  const { scenarios, loading } = useSensitivityAnalysisAdapter(clientId);
  const [activeTab, setActiveTab] = useState('simulations');

  return {
    state: { scenarios, loading, activeTab },
    computed: { baseElasticityPct: 12.5 },
    actions: { setActiveTab }
  };
}
