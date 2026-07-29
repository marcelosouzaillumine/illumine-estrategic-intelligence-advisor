import { useState } from 'react';
import { useLeadershipProfileAdapter } from '../adapters/ui/useLeadershipProfileAdapter.ts';

export function useLeadershipProfileViewModel({ clientId }: any) {
  const { profileData, loading } = useLeadershipProfileAdapter(clientId);
  const [activeTab, setActiveTab] = useState('skills');

  return {
    state: {
      profileData,
      loading,
      activeTab
    },
    computed: {
      governanceAdherenceScore: 88.5
    },
    actions: {
      setActiveTab
    }
  };
}
