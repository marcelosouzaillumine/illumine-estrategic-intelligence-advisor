import { useState } from 'react';
import { useAvaliacaoOrganogramaAdapter } from '../../../adapters/ui/useAvaliacaoOrganogramaAdapter.ts';

export function useAvaliacaoOrganogramaViewModel({ clientId }: any) {
  const { orgData, loading } = useAvaliacaoOrganogramaAdapter(clientId);
  const [activeTab, setActiveTab] = useState('chart');

  return {
    state: { orgData, loading, activeTab },
    computed: { leadershipMaturityIndex: 88.5 },
    actions: { setActiveTab }
  };
}
