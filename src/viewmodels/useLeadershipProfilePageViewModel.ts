import { useState } from 'react';
import { useLeadershipProfilePageAdapter } from '../adapters/ui/useLeadershipProfilePageAdapter.ts';

export function useLeadershipProfilePageViewModel({ clientId }: any) {
  const { leadersData, loading } = useLeadershipProfilePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('leaders');

  return {
    state: { leadersData, loading, activeTab },
    computed: { executiveAlignmentScorePct: 96.5 },
    actions: { setActiveTab }
  };
}
