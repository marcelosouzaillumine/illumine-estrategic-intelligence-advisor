import { useState } from 'react';
import { useEarlyWarningPageAdapter } from '../../../adapters/ui/useEarlyWarningPageAdapter.ts';

export function useEarlyWarningPageViewModel({ clientId }: any) {
  const { alerts, loading } = useEarlyWarningPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('warnings');

  return {
    state: { alerts, loading, activeTab },
    computed: { activeWarningsCount: 1 },
    actions: { setActiveTab }
  };
}
