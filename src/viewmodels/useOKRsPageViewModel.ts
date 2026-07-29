import { useState } from 'react';
import { useOKRsPageAdapter } from '../adapters/ui/useOKRsPageAdapter.ts';

export function useOKRsPageViewModel({ clientId }: any) {
  const { okrsData, loading } = useOKRsPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('okrs');

  return {
    state: { okrsData, loading, activeTab },
    computed: { averageOkrCompletionPct: 87.4 },
    actions: { setActiveTab }
  };
}
