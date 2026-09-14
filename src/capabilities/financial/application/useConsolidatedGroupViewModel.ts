import { useState } from 'react';
import { useConsolidatedGroupAdapter } from '../../../adapters/ui/useConsolidatedGroupAdapter.ts';

export function useConsolidatedGroupViewModel({ clientId }: any) {
  const { groupData, loading } = useConsolidatedGroupAdapter(clientId);
  const [activeTab, setActiveTab] = useState('summary');

  return {
    state: {
      groupData,
      loading,
      activeTab
    },
    computed: {
      totalEntities: 0
    },
    actions: {
      setActiveTab
    }
  };
}
