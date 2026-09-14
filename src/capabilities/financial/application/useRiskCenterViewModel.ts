import { useState } from 'react';
import { useRiskCenterAdapter } from '../../../adapters/ui/useRiskCenterAdapter.ts';

export function useRiskCenterViewModel({ clientId }: any) {
  const { risks, loading } = useRiskCenterAdapter(clientId);
  const [activeTab, setActiveTab] = useState('matrix');

  return {
    state: { risks, loading, activeTab },
    computed: { highPriorityRisksCount: 4 },
    actions: { setActiveTab }
  };
}
