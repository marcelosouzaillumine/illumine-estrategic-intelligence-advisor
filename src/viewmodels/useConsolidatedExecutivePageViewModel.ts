import { useState } from 'react';
import { useConsolidatedExecutivePageAdapter } from '../adapters/ui/useConsolidatedExecutivePageAdapter.ts';

export function useConsolidatedExecutivePageViewModel() {
  const { consolidatedData, loading } = useConsolidatedExecutivePageAdapter();
  const [activeTab, setActiveTab] = useState('consolidation');

  return {
    state: { consolidatedData, loading, activeTab },
    computed: { groupValuationTotal: 120000000 },
    actions: { setActiveTab }
  };
}
