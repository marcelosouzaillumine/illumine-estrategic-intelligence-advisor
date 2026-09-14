import { useState } from 'react';
import { useExecutiveAppBaseAdapter } from '../../../adapters/ui/useExecutiveAppBaseAdapter.ts';

export function useExecutiveAppBaseViewModel() {
  const { appState, loading } = useExecutiveAppBaseAdapter();
  const [activeTab, setActiveTab] = useState('base');

  return {
    state: { appState, loading, activeTab },
    computed: { systemReady: true },
    actions: { setActiveTab }
  };
}
