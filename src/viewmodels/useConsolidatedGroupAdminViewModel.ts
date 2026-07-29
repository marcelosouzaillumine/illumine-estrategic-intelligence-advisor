import { useState } from 'react';
import { useConsolidatedGroupAdminAdapter } from '../adapters/ui/useConsolidatedGroupAdminAdapter.ts';

export function useConsolidatedGroupAdminViewModel() {
  const { groupEntities, loading } = useConsolidatedGroupAdminAdapter();
  const [activeTab, setActiveTab] = useState('entities');

  return {
    state: { groupEntities, loading, activeTab },
    computed: { activeEntitiesCount: 4 },
    actions: { setActiveTab }
  };
}
