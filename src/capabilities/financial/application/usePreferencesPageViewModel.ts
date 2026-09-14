import { useState } from 'react';
import { usePreferencesPageAdapter } from '../../../adapters/ui/usePreferencesPageAdapter.ts';

export function usePreferencesPageViewModel({ clientId }: any) {
  const { preferencesData, loading } = usePreferencesPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('preferences');

  return {
    state: { preferencesData, loading, activeTab },
    computed: { isThemeConfigured: true },
    actions: { setActiveTab }
  };
}
