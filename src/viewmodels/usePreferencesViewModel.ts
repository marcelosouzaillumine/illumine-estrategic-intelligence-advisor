import { useState } from 'react';
import { usePreferencesAdapter } from '../adapters/ui/usePreferencesAdapter.ts';

export function usePreferencesViewModel({ clientId }: any) {
  const { preferences, loading } = usePreferencesAdapter(clientId);
  const [activeTab, setActiveTab] = useState('general');

  return {
    state: {
      preferences,
      loading,
      activeTab
    },
    computed: {
      theme: 'dark'
    },
    actions: {
      setActiveTab
    }
  };
}
